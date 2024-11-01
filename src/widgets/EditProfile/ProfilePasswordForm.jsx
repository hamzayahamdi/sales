// components
import PasswordInput from '@components/PasswordInput';
import {toast} from 'react-toastify';

// hooks
import {useForm, Controller} from 'react-hook-form';

const ProfilePasswordForm = () => {
    const {handleSubmit, control, watch, formState: {errors}} = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            repeatNewPassword: ''
        }
    });

    // do something with the form data
    const onSubmit = data => {
        console.log(data);
        toast.success('Password changed successfully!');
    }

    return (
        <form className="px-4 py-5 rounded-2xl border dark:bg-body dark:border-body grid grid-cols-1 gap-4
              md:grid-cols-2 md:gap-y-6"
              onSubmit={handleSubmit(onSubmit)}>
            <Controller name="currentPassword"
                        control={control}
                        rules={{required: true}}
                        render={({field}) => (
                            <PasswordInput id="currentPassword"
                                           label="Current Password"
                                           placeholder="Enter Current Password"
                                           isInvalid={errors.currentPassword}
                                           innerRef={field.ref}
                                           value={field.value}
                                           onChange={field.onChange}/>
                        )}/>
            <Controller name="newPassword"
                        control={control}
                        render={({field}) => (
                            <PasswordInput id="newPassword"
                                           label="New Password"
                                           placeholder="Enter New Password"
                                           isInvalid={errors.newPassword}
                                           innerRef={field.ref}
                                           value={field.value}
                                           onChange={field.onChange}/>
                        )}/>
            <Controller name="repeatNewPassword"
                        control={control}
                        rules={{validate: value => value === watch('newPassword')}}
                        render={({field}) => (
                            <PasswordInput id="repeatNewPassword"
                                           label="Repeat New Password"
                                           placeholder="Repeat new password"
                                           isInvalid={errors.repeatNewPassword}
                                           innerRef={field.ref}
                                           value={field.value}
                                           onChange={field.onChange}/>
                        )}/>
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-end md:gap-[30px] md:mt-6">
                <button className="text-header font-semibold hover:text-peach"
                        onClick={e => e.preventDefault()}>
                    Forgot password?
                </button>
                <button className="btn btn--primary w-full md:w-[140px] lg:w-[200px]" type="submit">
                    <span className="md:hidden lg:inline">Change password</span>
                    <span className="hidden md:inline lg:hidden">Save</span>
                </button>
            </div>
        </form>
    )
}

export default ProfilePasswordForm