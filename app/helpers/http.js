import Constants from '../config/constants';

const {
  SERVER_FAIL, FETCH_USERS_LIST_SUCCESS, GET_PROFILE, UPDATE_FROM_SERVER_FAIL,
  FETCH_USERS_LIST_FAIL, INCORRECT_PASS, LOGIN_SUCCESS, PASSWORD_UPDATE_FAIL,
  PASSWORD_UPDATE_SUCCESS, UPDATE_USER_ACTIVITY_FAIL, USER_EXISTS_FAIL,
  VERIFICATION_CODE_FAIL,
  REGISTER_SUCCESS,
} = Constants.USER_SERVICE;

/**
 * Simple response handler for services
 * @param {string} event
 * @param {Object} information to pass on to response
 */

exports.responseHandler = (event, info) => {
  switch (event) {
    case SERVER_FAIL:
      return {
        data: {
          error: 'Something went wrong',
        },
        status: 500,
      };
    case REGISTER_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const { user } = info;
      return {
        data: {
          user,
        },
        status: 200,
      };
    case UPDATE_FROM_SERVER_FAIL:
      // eslint-disable-next-line no-case-declarations
      const { id } = info;
      return {
        data: {
          error: `Error updating user password with id=${id}`,
        },
        status: 500,
      };
    case FETCH_USERS_LIST_FAIL:
      return {
        data: {
          error: 'Cannot fetch users list',
        },
        status: 500,
      };
    case INCORRECT_PASS:
      return {
        data: {
          error: 'Incorrect password',
        },
        status: 400,
      };
    case LOGIN_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const { token, changePassword } = info;
      return {
        data: {
          message: 'login successfully',
          token,
          changePassword,
          success: 1,
        },
        status: 200,
      };
    case PASSWORD_UPDATE_FAIL:
      return { data: { error: 'Error updating password' }, status: 400 };
    case PASSWORD_UPDATE_SUCCESS:
      return { data: { message: 'password updated successfully' }, status: 200 };
    case VERIFICATION_CODE_FAIL:
      return { data: { error: 'Verification code is invalid or expired' }, status: 400 };
    case UPDATE_USER_ACTIVITY_FAIL:
      return {
        data: {
          error: 'Cannot update user activity',
        },
        status: 400,
      };
    case GET_PROFILE:
      // eslint-disable-next-line no-case-declarations
      const { finalUser } = info;
      return {
        data: {
          ...finalUser,
        },
        status: 200,
      };
    case USER_EXISTS_FAIL:
      return { data: { error: 'User does not exist' }, status: 400 };
    case FETCH_USERS_LIST_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const { users } = info;
      return {
        data: {
          users,
        },
        status: 200,
      };
    default:
      return { data: {}, status: 400 };
  }
};
