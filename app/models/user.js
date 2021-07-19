/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import mongoose from 'mongoose';
import moment from 'moment';

const Schema = mongoose.Schema;

// user schema
const userSchema = new Schema(
    {
      fullName: {
        type: String,
      },

      email: {
        type: String,
      },
      password: {
        type: String,
      },
      verificationCode: {
        type: String,
        default: null,
      },
      meta: {
        type: String,
        default: '',
      },
      token: {
        type: String,
        default: ''
      },
      subscriptionId: {
        type: String,
        default: null,
      },
      trial_period_start: {
        type: Date, 
        default: new Date()
      }, 
      subscriptionStatus: {
        type: String,
        default: ''
      },
      isActive: {
        type: Boolean,
        default: false,
      }
    },
    {
      timestamps: true,
    });

const User = mongoose.model('user', userSchema);

export default User;
