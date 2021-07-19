/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
import BaseController from './base.controller';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import mongoose from 'mongoose';
import Constants from '../config/constants';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import qs from 'qs';
import { sendResetPassEmail, confirmationUserEmail } from '../lib/util';
import { generateSixDigitCode } from '../helpers';
import moment from 'moment';
const stripe = require('stripe')('sk_test_51JCZJNGQvqXDs7J10dd3Wi6PmcI2kIYzU5v6PFoSi6Ee4GBkDz87Fw4aMI9lKZ1LcsvLnQJss5cqyNuliAk2S0OH00Rm2MbOjh');

const stripDefaultObject = {
		type: 'card',
		card: {
		  number: '4242424242424242',
		  exp_month: 6,
		  exp_year: 2022,
		  cvc: '314',
		},
}
const priceId = 'price_1J6XX1Cxa2qwVR0HSQQsW4AW';
class UsersController extends BaseController {
	whitelist = [
	  'phoneNumber',
	  'fullName',
	  'email',
	  'userId',
	  'verificationCode',
	  'password'
	];
	isUserActive = (user) => {
		const isActive = user.isActive;
		if(isActive) {
			return true;
		}
		return false;
	}

	login = async (req, res, next) => {
		const { email, password } = req.body;
		let subscription;
		let isTrialExpired = false;
		try {
		  // See if user exist
		  const user = await User.findOne({ email });
		  if (!user) {
			return res.status(200).json({ message: 'Invalid Email or Password', success: 0 });
		  }
		  if(user && !user.isActive) {
			  return res.status(200).json({message: 'please activate your account to proceed further', success: 0})
		  }
		  const isMatch = await bcrypt.compare(password, user.password);
		  if (!isMatch) {
			return res.status(200).json({ message: 'Invalid Email or Password', success: 0 });
		  }
		  if(user.isActive) {

			const startDate = moment(user.trial_period_start);
			const todayDate = moment(new Date());
			const diffInDays = todayDate.diff(startDate, 'days')
			if(diffInDays > 1) {
				isTrialExpired = true;
			}
			}

		     jwt.sign({ user }, Constants.security.sessionSecret, { expiresIn: Constants.security.sessionExpiration },
			  (err, token) => {
			 if (err) throw err;
			return res.status(200).json({ token, success: 1, user, isTrialExpired: isTrialExpired });
		  });
		} catch (error) {
		  error.status = 400;
		  next(error);
		}
	  };

	  getMovies = async (req, res, next) => {
	
		var options = {
		  method: 'GET',
		  url: 'https://devru-bigflix-movies-download-v1.p.rapidapi.com/movieList.php',
		  params: {resultsperpage: '10', pageIndex: '1'},
		  headers: {
			'x-rapidapi-key': '711a5a8160msh41962512aa98002p17cdb4jsn8c8755a743b6',
			'x-rapidapi-host': 'devru-bigflix-movies-download-v1.p.rapidapi.com'
		  }
		};
		
		axios.request(options).then(function (response) {
			console.log(response.data);
		}).catch(function (error) {
			console.error(error)
		});
		
	  }
	
	register = async (req, res, next) => {
	  const params = this.filterParams(req.body, this.whitelist);
	  try {
	    // Encrypt password
		const user = await User.findOne({ email : params['email']}).exec();
		if(user) {
			return res.status(200).json({
				message: 'User already exist with this email',
				success: 0
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(params['password'], salt);
		params['password'] = hash;
		const newUser = new User(
	        {
	          ...params,
	        },
		);
		const updatedUser = await newUser.save();
		// create user on stripe
		if(updatedUser){
			const token = generateSixDigitCode();
			confirmationUserEmail(updatedUser, token);
		}
	    jwt.sign({ updatedUser }, Constants.security.sessionSecret, { expiresIn: Constants.security.sessionExpiration },
	        (err, token) => {
			  if (err) throw err;
	          return res.status(200).json({
	        token,
	        newUser,
			success: 1,
			message: 'Confirmation email has been sent, please verify to continue',
			type: 'success',
			redirect: true,
			phoneNumber: params['phoneNumber']
			  });
	        });
	  } catch (err) {
	    err.status = 200;
	    next(err);
	  }
	};

	verifyCode = async (req, res, next) => {
	  try {
	    const params = this.filterParams(req.body, this.whitelist);
	    const user = await User.findOne({
		  verificationCode: params['verificationCode'],
	    });
	    if (!user) {
	      return res.status(200).json({
	        success: 0,
			message: 'You entered an invalid code',

	      });
	    }
	    const updatedUser = await User.findByIdAndUpdate(
	        user._id,
	        {
			  $set: {
	            verificationCode: null,
			  },
	        },
	        { new: true },
	    );
	    return res.status(200).json({
	      success: 1,
		  message: 'Code is verified!, You are loggedIn successfully!',
		  user: updatedUser,
	    });
	  } catch (error) {
	    next(error);
	  }
	}
	
	chargeFromCustomer = async(req, res, next) => {

		try{
				const token = req.body.stripeToken; // Using Express
				const amount = req.body.amount;
				const charge = await stripe.charges.create({
				amount: amount,
				currency: 'usd',
				description: 'OffMedia One Time subscription',
				source: token.id,
				metadata: {source: 'website'},
				});
				if(!charge) {
					return res.status(200).json({
						message: 'something wents wrong!',
						success: 0
					})
				}
				return res.status(200).json({
					message: "payment is successful!",
					success: 1,
					stripDate: charge
				})

		} catch(err) {
			next(err);
		}
	};

	charge = async(req, res, next) => {
		try {
			const userId = req.body.userId;
			 console.log('userId', userId);
			const session = await stripe.checkout.sessions.create({
			  mode: 'subscription',
			  payment_method_types: ['card'],
			  line_items: [
				{
				  price: req.body.priceId,
				  // For metered billing, do not pass quantity
				  quantity: 1,
				},
			  ],
			  // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
			  // the actual Session ID is returned in the query parameter when your customer
			  // is redirected to the success page.
			  success_url: `${req.body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
			  cancel_url: `${req.body.failureUrl}`,
			});
			await User.findByIdAndUpdate(
				userId,
				{
				  $set: {
					subscriptionStatus: 'paid',
				  },
				},
				{ new: true },
			);
			res.send({
			  sessionId: session.id,
			});
		  } catch (e) {
			res.status(400);
			return res.send({
			  error: {
				message: e.message,
			  }
			});
		  }
	}
    updatePassword = async (req, res, next) => {
		const { newPassword, userId } = req.body;
		try {
			const Id = userId;
			const user = await User.findOne({ _id: mongoose.Types.ObjectId(Id) });
			if (!user) {
			return res.status(200).json({ message: Constants.messages.userNotFound, success: 0 });
			}

			const salt = await bcrypt.genSalt(10);
			const updatedUser = await User.findByIdAndUpdate(
				Id,
				{
					$set: {
					password: await bcrypt.hash(newPassword, salt),
					},
				},
				{ new: true },
			).select('-password');
			return res.status(200).json({ message: Constants.messages.userPasswordChangeSuccess, success: 1, user: updatedUser });


		} catch (err) {
			err.status = 400;
			next(err);
		}
		};

	forgetPassword = async(req, res, next) => {
		try {
			const { email } = req.body;
			const user = await User.findOne({ email }).exec();
			if(!user) {
				return res.status(200).json({
					message: "user not found",
					success: 1
				})
			}
			const token = generateSixDigitCode();
			sendResetPassEmail(user, token);

				return res.status(200).json({
					message: 'Reset password Link has been sent via an email',
					success: 1
				})
		} catch(err) {
			next(err);
		}
		}
		
	activateUser = async (req, res, next) => {
        try {

			const { userId, token } = req.body;
			await User.findOne({_id: userId });
			if(token) {
				const updated = await User.findByIdAndUpdate(
					userId,
					{
					  $set: {
						isActive: true
					  },
					},
					{ new: true },
				).select('-password');
				// if(userDetail) {
				
				// 	stripe.customers.create({
				// 		email: userDetail.email,
				// 	  })
				// 		.then(async (customer) =>
				// 			{
				// 			const { id: paymentMethodId } = await stripe.paymentMethods.create(stripDefaultObject);
				// 			const attachedMethod = await stripe.paymentMethods.attach(
				// 				paymentMethodId,
				// 				{customer: customer.id }
				// 			  );

				// 			const subscription = await stripe.subscriptions.create({
				// 			customer: customer.id,
				// 			default_payment_method: attachedMethod.id,
				// 			items: [
				// 			  {
				// 				price: priceId,
				// 				quantity: 1,
				// 			  },
				// 			],
				// 		  })
				// 		  if(subscription) {
				// 			 const updateUserSubscriptionKeys = await User.findByIdAndUpdate(
				// 				userDetail._id,
				// 				{
				// 				  $set: {
				// 					subscriptionId: subscription.id,
				// 					subscriptionStatus: subscription.status
				// 				  },
				// 				},
				// 				{ new: true },
				// 				);
				// 			  console.log('you have succesfully subscribed', updateUserSubscriptionKeys);
				// 		  }
				// 		})

				// 		.catch(error => console.error('stripe user error in creation of user',error));
				// }

				if(updated) {
					res.status(200).json({
						message: 'User has been activated successfully!',
						success: 1
					});
				}
			}
		  } catch (err) {
			next(err);
		  }
	}
}

export default new UsersController();
