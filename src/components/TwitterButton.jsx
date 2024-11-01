// components
import {LoginSocialTwitter} from 'reactjs-social-login';
import {toast} from 'react-toastify';

// utils
import PropTypes from 'prop-types';

// assets
import logo from '@assets/twitter.svg';

const TwitterButton = ({text = 'Sign In', onSubmit}) => {
    const onReject = (err) => {
        toast.error(err);
    }

    const isDev = import.meta.env.DEV;

    return (
        <LoginSocialTwitter className="btn btn--base h-[50px] gap-2.5 cursor-pointer"
                            client_id={import.meta.env.VITE_TWITTER_API_KEY}
                            client_secret={import.meta.env.VITE_TWITTER_API_SECRET}
                            redirect_uri={isDev ? 'http://localhost:3000' : 'https://comvi.merku.love'}
                            onReject={onReject}
                            onResolve={onSubmit}>
            <img className="w-[22px]"
                 src={logo}
                 alt="Google"
                 width={22}
                 height={22}/>
            {text} with Twitter
        </LoginSocialTwitter>
    )
}

TwitterButton.propTypes = {
    onSubmit: PropTypes.func,
    text: PropTypes.string
}

export default TwitterButton