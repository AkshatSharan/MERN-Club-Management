import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import mongoose from "mongoose";
import crypto from 'crypto'

const clubSchema = new mongoose.Schema({
    clubName: {
        type: String,
        required: true,
    },
    clubLogo: {
        type: String,
        required: false,
        default: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
    },
    clubEmail: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    displayDescription: String,
    clubDescription: String,
    upcomingEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpcomingEvent'
    }],
    recruiting: {
        type: Boolean,
        default: false
    },
    pastEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PastEvent'
    }],
    applicationForm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApplicationForm'
    }],
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    socials: [
        {
            name: {
                type: String,
                enum: ['X', 'instagram', 'facebook', 'linkedin'],
                required: true,
            },
            url: String,
        }
    ],
    isPosted: {
        type: Boolean,
        default: false
    },
    gallery: [String],
    clubSecret: {
        type: String,
        unique: true,
    },
    refreshToken: {
        type: String
    },
});

clubSchema.pre('save', function (next) {
    if (!this.clubSecret) {
        const secureRandomString = crypto.randomBytes(20).toString('hex');
        this.clubSecret = secureRandomString
    }
    next()
})

clubSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

clubSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            clubSecret: this.clubSecret
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

clubSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            clubSecret: this.clubSecret
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default mongoose.model("Club", clubSchema);
