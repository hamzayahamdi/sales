// components
import {LoginSocialGoogle} from 'reactjs-social-login';
import {toast} from 'react-toastify';

// utils
import PropTypes from 'prop-types';

// assets
import logo from '@assets/google.svg';

const GoogleButton = ({text = 'Sign In', onSubmit}) => {
    const onReject = (err) => {
        toast.error(err);
    }

    return (
        <LoginSocialGoogle className="btn btn--base h-[50px] gap-2.5 cursor-pointer"
                           client_id={import.meta.env.VITE_GOOGLE_APP_ID}
                           onReject={onReject}
                           onResolve={onSubmit}>
            <img className="w-[22px]"
                 src={logo}
                 alt="Google"
                 width={22}
                 height={22}/>
            {text} with Google
        </LoginSocialGoogle>
    )
}

GoogleButton.propTypes = {
    onSubmit: PropTypes.func,
    text: PropTypes.string
}

export default GoogleButton