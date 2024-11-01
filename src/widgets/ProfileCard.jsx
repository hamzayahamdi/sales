// components
import Spring from '@components/Spring';
import EditButton from '@ui/EditButton';

// assets
import user from '@assets/user.webp';

const placeholder = {
    firstName: 'Helena',
    lastName: 'Brauer',
    avatar: user,
    role: 'admin',
    mobile: '+1-9846499950',
    email: 'dashboard@comvi.com',
    city: 'California',
    country: 'United States'
}

const ProfileCard = ({data = placeholder, isPrivate}) => {
    const fullName = `${data.firstName} ${data.lastName}`;
    const address = `${data.city}, ${data.country}`;

    return (
        <Spring className="card flex flex-col p-5 h-full xs:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2>{isPrivate ? 'My Profile' : 'Client Details'}</h2>
                {
                    !isPrivate && <EditButton/>
                }
            </div>
            <div className="flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col items-center gap-4 xs:flex-row xs:gap-6">
                    <div className="relative">
                        <img className="w-20 h-20 rounded-full" src={data.avatar} alt={fullName}/>
                        {
                            isPrivate &&
                            <button className="w-6 h-6 rounded-full bg-peach absolute bottom-0 -right-1 flex items-center justify-center"
                                    aria-label="Change profile picture">
                                <i className="icon-camera-solid text-[11px] text-white"/>
                            </button>
                        }
                    </div>
                    <div className="flex flex-col items-center gap-2 xs:items-start">
                        <h3>{fullName}</h3>
                        <span className="text-header font-semibold uppercase">{data.role}</span>
                    </div>
                </div>
                <ul>
                    {
                        isPrivate &&
                        <li className="flex justify-between items-center font-medium pb-[14px] border-b">
                            <span className="text-xs text-label uppercase">Full Name :</span>
                            <span>{fullName}</span>
                        </li>
                    }
                    <li className="flex justify-between items-center font-medium pt-4 pb-[14px] border-b">
                        <span className="text-xs text-label uppercase">Mobile :</span>
                        {
                            isPrivate ?
                                <span>{data.mobile}</span>
                                :
                                <a href={`tel:${data.mobile}`}>{data.mobile}</a>
                        }
                    </li>
                    <li className="flex justify-between items-center font-medium pt-4 pb-[14px] border-b">
                        <span className="text-xs text-label uppercase">E-mail :</span>
                        {
                            isPrivate ?
                                <span className="max-w-[160px] truncate xxs:max-w-[200px]">
                                {data.email}
                            </span>
                                :
                                <a className="max-w-[160px] truncate xxs:max-w-[200px]"
                                   href={`mailto:${data.email}`}>
                                    {data.email}
                                </a>
                        }
                    </li>
                    <li className={`flex justify-between items-center font-medium pt-4 ${!isPrivate ? 'pb-[14px] border-b' : ''}`}>
                        <span className="text-xs text-label uppercase">Location :</span>
                        <span className="max-w-[160px] truncate xxs:max-w-[200px]">
                        {isPrivate ? address : data.location1}
                    </span>
                    </li>
                    {
                        !isPrivate &&
                        <li className="flex justify-between items-center font-medium pt-4">
                            <span className="text-xs text-label uppercase">Location:</span>
                            <span className="max-w-[160px] truncate xxs:max-w-[200px]">
                            {data.location2}
                        </span>
                        </li>
                    }
                </ul>
            </div>
        </Spring>
    )
}

export default ProfileCard