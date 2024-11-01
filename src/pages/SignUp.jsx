// components
import AuthLayout from '@components/AuthLayout';
import PasswordInput from '@components/PasswordInput';
import GoogleButton from '@components/GoogleButton';
import TwitterButton from '@components/TwitterButton';

// hooks
import {useForm, Controller} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {useTheme} from '@contexts/themeContext';

// utils
import classNames from 'classnames';

const SignUp = () => {
    const {register, control, handleSubmit, formState: {errors}} = useForm();
    const navigate = useNavigate();
    const {theme} = useTheme();

    const onSubmit = () => navigate('/');

    return (
        <AuthLayout title="Create an Account">
            <div className="flex flex-col gap-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-5 mb-6">
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="name">
                                Name
                            </label>
                            <input className={classNames('field-input', {'field-input--error': errors.name})}
                                   id="name"
                                   type="text"
                                   placeholder="Enter your name"
                                   {...register('name', {required: true})}/>
                        </div>
                        <div className="field-wrapper">
                            <label className="field-label" htmlFor="email">
                                Email
                            </label>
                            <input className={classNames('field-input', {'field-input--error': errors.email})}
                                   id="email"
                                   type="text"
                                   placeholder="Enter your email"
                                   {...register('email', {required: true, pattern: /^\S+@\S+$/i})}/>
                        </div>
                        <Controller name="password"
                                    control={control}
                                    rules={{required: true}}
                                    render={({field}) => (
                                        <PasswordInput id="password"
                                                       placeholder="Enter your password"
                                                       isInvalid={errors.password}
                                                       value={field.value}
                                                       onChange={field.onChange}
                                                       innerRef={field.ref}/>
                                    )}/>
                    </div>
                    <button className={`btn btn--primary w-full ${theme === 'light' ? 'green' : ''}`}
                            type="submit">
                        Create an Account
                    </button>
                </form>
                <div className="flex flex-col gap-4 xs:gap-6">
                    <GoogleButton text="Sign Up" onSubmit={onSubmit}/>
                    <TwitterButton text="Sign Up" onSubmit={onSubmit}/>
                </div>
                <p className="flex items-center justify-center gap-3">
                    Already have an Account?
                    <a className="font-semibold text-[15px] text-sidebar dark:text-peach hover:text-header"
                       href="/sign-in">
                        Sign In
                    </a>
                </p>
            </div>
        </AuthLayout>
    )
}

export default SignUp