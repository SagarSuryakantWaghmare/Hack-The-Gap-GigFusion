import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from "../models/user.model.js";
import { ServiceProvider } from "../models/serviceProvider.js";
import WorkerDocuments from '../models/ServiceProviderDocuments.model.js';
import { Review } from "../models/review.model.js";

// Controller for fetching service providers by city
const getServiceProviderByCity = asyncHandler(async (req, res) => {
    const { city } = req.query;
    const serviceProviders = await User.find({ city, userType: 'serviceProvider' });
    return res.status(200).json(new ApiResponse(200, serviceProviders, "Service Providers fetched successfully"));
});

// Controller for fetching service provider details
const getServiceProviderDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const serviceProvider = await ServiceProvider.findOne({ userId: id });
    let data = {};
    if (serviceProvider == null) {
        data = user.toObject();
    } else {
        data = { ...user.toObject(), ...serviceProvider.toObject() }
        // console.log(data);
    }
    return res.status(200).json(new ApiResponse(200, data, "Service Provider details fetched successfully"));
});

// Controller for fetching service provider reviews
const getServiceProviderReviews = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reviews = await Review.find({ tradesperson: id }).populate('user', 'fullName');
    return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// Controller for updating service provider profile
const updateServiceProviderProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { professions, experience, location, availability, additionalDetails, badges } = req.body
    const { fullName, email, contact, city, state, zipcode } = req.body;

    if ([fullName, email, contact, zipcode, state, city, professions, experience, location, availability, additionalDetails, badges].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const serviceProvider = await ServiceProvider.findOneAndUpdate(
        req.user?._id,
        {
            $set: {
                professions,
                experience,
                location,
                availability,
                additionalDetails,
                badges,
            }
        },
        { new: true }

    );

    const user = await User.findOneAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email,
                contact,
                city,
                state,
                zipcode,
            }
        }
    ).select("-password");

    const data = { ...user.toObject(), ...serviceProvider.toObject() };

    return res.status(200).json(new ApiResponse(200, data, "Service Provider profile updated successfully"));
});

// const registerSP = asyncHandler(async (req, res) => {

const registerSP = asyncHandler(async (req, res) => {
    // console.log('Body', req.body);
    const { professions, experience, location, availability, additionalDetails, badges } = req.body;
    const { fullName, email, contact, city, state, zipcode } = req.body;

    if ([fullName, email, contact, city, state, zipcode].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    let user = await User.findById(req.user._id);
    let avatar = '';
    let coverImage = '';
    if (!user) {
        user = await User.create({
            fullName,
            email,
            contact,
            city,
            state,
            zipcode,
            avatar,
            coverImage,
            userType: 'serviceProvider'
        });
    } else {

        // console.log('Req Files', req.files);
        if (req.files?.avatar) {
            const avatarLocalPath = req.files?.avatar[0]?.path;
            // console.log('Avatar Local Path', avatarLocalPath);
            if (!avatarLocalPath) {
                throw new ApiError(404, 'Avatar is required!');
            }

            avatar = await uploadOnCloudinary(avatarLocalPath);
            if (!avatar) {
                throw new ApiError(400, 'Something went wrong while uploading Avatar on Cloudinary');
            }
        } else {
            avatar = req.user.avatar;
        }

        if (req.files?.coverImage) {
            const coverImageLocalPath = req.files?.coverImage[0]?.path;
            // console.log('Cover Image Local Path', coverImageLocalPath);
            coverImage = '';
            if (!coverImageLocalPath) {
                coverImage = '';
            } else {
                coverImage = await uploadOnCloudinary(coverImageLocalPath);
                if (!coverImage) {
                    throw new ApiError(400, 'Something went wrong while uploading Cover Image on Cloudinary');
                }
            }
        } else {
            coverImage = req.user.coverImage;
        }

        user = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $set: {
                    fullName,
                    email,
                    contact,
                    city,
                    state,
                    zipcode,
                    avatar: avatar.url || avatar,
                    coverImage: coverImage.url || coverImage,
                }
            },
            { new: true }
        )
    }

    if ([professions, experience, location, availability, additionalDetails, badges].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const professionList = professions.split(',').map((profession) => profession.trim());
    const additionalDetailsList = additionalDetails.split(',').map((detail) => detail.trim());
    const badgesList = badges.split(',').map((badge) => badge.trim());
    // console.log('Professions', professionList);
    // console.log('Additional Details', additionalDetailsList);
    // console.log('Badges', badgesList);

    let sp = await ServiceProvider.findOne({ userId: req.user._id });
    if (!sp) {
        sp = await ServiceProvider.create({
            userId: req.user._id,
            professions: professionList,
            experience,
            location,
            availability,
            additionalDetails: additionalDetailsList,
            badges: badgesList,
        });
    } else {
        sp = await ServiceProvider.findOneAndUpdate(
            { userId: req.user._id },
            {
                $set: {
                    professions,
                    experience,
                    location,
                    availability,
                    additionalDetails,
                    badges
                }
            },
            { new: true }
        );
    }

    const createdSP = await User.findById(sp.userId);
    if (!createdSP) {
        throw new ApiError(400, "Service Provider Data Saving Failed");
    }

    const response = res.status(201).json(
        new ApiResponse(200, createdSP, "Service Provider Data updated and saved successfully")
    );
    console.log('SP registered Successfully');

    return response;
});

//     const { professions, experience, location, availability, additionalDetails, badges } = req.body
//     const { fullName, email, contact, city, state, zipcode, avatar, coverImage } = req.body;
//     // console.log('Body', req.body); // console.log('User', req.user);

//     if ([professions, experience, location, availability, additionalDetails, badges].some((field) => typeof field === 'string' && field.trim() === "")) {
//         throw new ApiError(400, "All fields are required")
//     }

//     const user = await ServiceProvider.findById(req.user._id);
//     if (!user) {
//         const sp = await ServiceProvider.create({
//             userId: req.user._id,
//             professions,
//             experience,
//             location,
//             availability,
//             additionalDetails,
//             badges
//         })
//     } else {
//         const sp = await ServiceProvider.findOneAndUpdate(req.user._id, {
//             $set: {
//                 professions,
//                 experience,
//                 location,
//                 availability,
//                 additionalDetails,
//                 badges
//             }
//         })
//     }
//     const createdSP = await User.findById(sp.userId);
//     if (!createdSP) {
//         throw new ApiError(400, "Service Provider Data Saving Failed");
//     }

//     const response = res.status(201).json(
//         new ApiResponse(200, createdSP, "Service Provider Data saved successfully")
//     );
//     console.log('SP registered Successfully');

//     return response;

// });

const setReview = asyncHandler(async (req, res) => {
    const { serviceProviderId, rating, reviewDescription } = req.body;
    const review = await Review.create({
        serviceProviderId,
        userId: req.user._id,
        rating,
        reviewDescription
    });
    console.log('Review saved successfully');
    return res.status(201).json(new ApiResponse(201, review, "Review saved successfully"));
})

const getReviews = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reviews = await Review.find({ serviceProviderId: id }).populate('userId', 'fullName');
    console.log('Reviews fetched successfully');
    return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
})

const getServiceProvidersByQuery = asyncHandler(async (req, res) => {
    const { query } = req.query;
    const { city } = req.query;
    console.log('City', city);
    console.log('Query', query);

    const queryWords = query.split(/\s*,\s*|\s+/);
    const regexPatterns = queryWords.map(word => ({
        $regex: word,
        $options: 'i'
    }));

    const searchCriteria = {
        $or: [
            { professions: { $all: regexPatterns } },
            { location: { $all: regexPatterns } },
            { availability: { $all: regexPatterns } },
            { additionalDetails: { $all: regexPatterns } },
            { badges: { $all: regexPatterns } }
        ]
    };

    const serviceProviders = await ServiceProvider.find(searchCriteria);

    console.log('Service Providers fetched successfully!', serviceProviders);

    return res.status(200)
        .json(new ApiResponse(
            200,
            serviceProviders,
            "Service Providers fetched successfully according to query"
        ));
})

const uploadServiceProviderDocument = asyncHandler(async (req, res) => {
    const { IdentityProofNumber, AddressProofNumber, BankDetails, BankAccountNumber, IFSCCode, BankBranch, BankName } = req.body
    const workerId = req.user._id;

    if ([IdentityProofNumber, AddressProofNumber, BankDetails, BankAccountNumber, IFSCCode, BankBranch, BankName].include('')) {
        throw new ApiError(400, 'All fields are required');
    }

    const ExistingDocuments = await WorkerDocuments.find({
        $or: [
            { IdentityProofNumber }, { BankAccountNumber }
        ]
    });

    if (ExistingDocuments) {
        throw new ApiError(400, 'Documents already exists! Direct the user to update the documents according to procedure!!');
    }

    const IdentityProofLocalPath = req.files?.IdentityProof[0]?.path;
    if (!IdentityProofLocalPath) {
        throw new ApiError(404, 'Identity Proof Document is required!')
    }

    const AddressProofLocalPath = req.files?.AddressProof[0]?.path;
    if (!AddressProofLocalPath) {
        throw new ApiError(404, 'Address Proof Document is required!');
    }

    const IdentityProof = await uploadOnCloudinary(IdentityProofLocalPath);
    if (!IdentityProof) {
        throw new ApiError(400, 'Something went wrong while uploading Identity Proof on Cloudinary');
    }

    const AddressProof = await uploadOnCloudinary(AddressProofLocalPath);
    if (!AddressProof) {
        throw new ApiError(400, 'Something went wrong while uploading Address Proof on Cloudinary');
    }

    const workerDocuments = await WorkerDocuments.create({
        workerId,
        IdentityProof,
        IdentityProofNumber,
        AddressProof,
        AddressProofNumber,
        BankDetails,
        BankAccountNumber,
        IFSCCode,
        BankBranch,
        BankName
    })

    const createdWorkerDocument = await WorkerDocuments.findOne({ workerId });
    if (!createdWorkerDocument)
        throw new ApiError(400, 'Something went wrong while creating Worker Documents!')

    const response = res.status(200).json(new ApiResponse(200, createdWorkerDocument, 'Worker Document created successfully'));
    console.log('Worker Document created successfully');
    return response;
})

const updateServiceProviderDocument = asyncHandler(async (req, res) => {

})

const getServiceProviderDocuments = asyncHandler(async (req, res) => {

})

const getServiceProviderDocumentById = asyncHandler(async (req, res) => {

})

// Controller for fetching active jobs for a service provider
const getActiveJobs = asyncHandler(async (req, res) => {
    console.log('User: ', req);
    const serviceProviderId = req.user._id; // Corrected to use serviceProviderId
    console.log('ServiceProviderId: ', serviceProviderId);
    const activeJobs = await JobPost.find({
        userId: serviceProviderId,
        jobProgress: { $in: ['new', 'pending'] }
    });
    console.log('Active Jobs: ', activeJobs);
    return res.status(200).json(new ApiResponse(200, activeJobs, "Active jobs fetched successfully"));
});

// Controller for fetching service provider stats
const getServiceProviderStats = asyncHandler(async (req, res) => {
    const serviceProviderId = req.user._id;
    const totalJobs = await JobPost.countDocuments({ userId: serviceProviderId });
    const completedJobs = await JobPost.countDocuments({ userId: serviceProviderId, jobProgress: 'completed' });
    const pendingJobs = await JobPost.countDocuments({ userId: serviceProviderId, jobProgress: 'pending' });
    const rating = await JobPost.aggregate([
        { $match: { userId: serviceProviderId, rating: { $exists: true } } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    const stats = {
        totalJobs,
        completedJobs,
        pendingJobs,
        rating: rating[0]?.avgRating || 0
    };

    return res.status(200).json(new ApiResponse(200, stats, "Service provider stats fetched successfully"));
});

export {
    getServiceProviderByCity,
    getServiceProviderDetails,
    getServiceProviderReviews,
    updateServiceProviderProfile,
    registerSP,
    setReview,
    getReviews,
    getServiceProvidersByQuery,
    uploadServiceProviderDocument,
    updateServiceProviderDocument,
    getServiceProviderDocuments,
    getServiceProviderDocumentById,
    getActiveJobs,
    getServiceProviderStats
};