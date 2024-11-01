import AppBar from '@components/AppBar';
import AppGrid from '@components//AppGrid';
import ProfileCard from '@widgets/ProfileCard';
import LoginHistory from '@widgets/LoginHistory';
import EditProfile from '@widgets/EditProfile';

const widgets = {
    profile_card: <ProfileCard isPrivate/>,
    login_history: <LoginHistory/>,
    edit_profile: <EditProfile/>
}

const Settings = () => {
    return (
        <>
            <AppBar title="Settings"/>
            <AppGrid id="settings" widgets={widgets}/>
        </>
    )
}

export default Settings