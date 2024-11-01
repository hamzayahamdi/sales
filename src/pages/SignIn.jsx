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

const SignIn = () => {
    const {register, control, handleSubmit, formState: {errors}} = useForm();
    const navigate = useNavigate();
    const {theme} = useTheme();

    const onSubmit = () => navigate('/');

    return (
        <AuthLayout title="Sign In">
            <div className="flex flex-col gap-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="field-wrapper mb-5">
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
                    <button className={`btn btn--primary w-full mt-6 ${theme === 'light' ? 'green' : ''}`}
                            type="submit">
                        Sign In
                    </button>
                </form>
                <div className="flex flex-col gap-4 xs:gap-6">
                    <GoogleButton onSubmit={onSubmit}/>
                    <TwitterButton onSubmit={onSubmit}/>
                </div>
                <p className="flex items-center justify-center gap-3">
                    Don't have an Account?
                    <a className="font-semibold text-[15px] text-sidebar dark:text-peach hover:text-header"
                       href="/sign-up">
                        Sign Up
                    </a>
                </p>
            </div>
        </AuthLayout>
    )
}

export default SignIn