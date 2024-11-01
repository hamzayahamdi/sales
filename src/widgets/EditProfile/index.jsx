// components
import Spring from '@components/Spring';
import ProfileDataForm from './ProfileDataForm';
import ProfilePasswordForm from './ProfilePasswordForm';

const EditProfile = () => {
    return (
        <Spring className="card px-4 py-6 h-full xs:p-6">
            <div className="mb-6">
                <h2 className="mb-4">Edit Profile</h2>
                <ProfileDataForm/>
            </div>
            <div>
                <h2 className="mb-4">Change Password</h2>
                <ProfilePasswordForm/>
            </div>
        </Spring>
    )
}

export default EditProfile