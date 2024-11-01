// components
import {PatternFormat} from 'react-number-format';
import {toast} from 'react-toastify';
import Select from '@ui/Select';

// hooks
import {useForm, Controller} from 'react-hook-form';
import {useState, useEffect} from 'react';

// utils
import classNames from 'classnames';
import axios from 'redaxios';

const getCountriesList = () => {
    return axios.get('https://restcountries.com/v3.1/all')
        .then(res => {
                const countries = [];
                res.data.forEach(country => {
                    countries.push({value: country.cca2, label: country.name.common});
                });
                return countries.sort((a, b) => a.label.localeCompare(b.label));
            }
        )
        .catch(err => console.log(err));
}

const ProfileDataForm = () => {
    const [countries, setCountries] = useState();
    const {register, handleSubmit, setValue, control, formState: {errors}} = useForm();

    // do something with the form data
    const onSubmit = data => {
        console.log(data);
        toast.success('Profile updated successfully!');
    }

    useEffect(() => {
        getCountriesList().then(res => setCountries(res));
    }, []);

    return (
        <div className="px-4 pb-4 pt-5 rounded-2xl border dark:bg-body dark:border-body">
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-y-6">
                <div className="field-wrapper">
                    <label className="field-label" htmlFor="firstName">
                        First Name
                    </label>
                    <input className={classNames('field-input', {'field-input--error': errors.firstName})}
                           placeholder="Your First Name"
                           id="firstName"
                           type="text"
                           {...register('firstName', {required: true})}/>
                </div>
                <div className="field-wrapper">
                    <label className="field-label" htmlFor="lastName">
                        Last Name
                    </label>
                    <input className={classNames('field-input', {'field-input--error': errors.lastName})}
                           placeholder="Your Last Name"
                           id="lastName"
                           type="text"
                           {...register('lastName', {required: true})}/>
                </div>
                <div className="field-wrapper">
                    <label className="field-label" htmlFor="phone">
                        Phone Number
                    </label>
                    <Controller name="phone"
                                control={control}
                                defaultValue=""
                                render={({field}) => (
                                    <PatternFormat
                                        className={classNames('field-input', {'field-input--error': errors.phone})}
                                        placeholder="Your Phone Number"
                                        id="phone"
                                        format="+1 (###) ###-####"
                                        mask="_"
                                        getInputRef={field.ref}
                                        value={field.value}
                                        onValueChange={field.onChange}/>
                                )}/>
                </div>
                <div className="field-wrapper">
                    <label className="field-label" htmlFor="email">
                        Email
                    </label>
                    <input className={classNames('field-input', {'field-input--error': errors.email})}
                           placeholder="Your Email Address"
                           id="email"
                           type="text"
                           {...register('email', {required: true, pattern: /^\S+@\S+$/i})}/>
                </div>
                <div className="field-wrapper">
                    <label className="field-label" htmlFor="country">
                        Country
                    </label>
                    <Controller name="country"
                                control={control}
                                render={({field}) => (
                                    <Select variant="basic"
                                            placeholder="Select your country"
                                            id="country"
                                            isSearchable
                                            options={countries}
                                            value={field.value}
                                            onChange={value => {
                                                field.onChange(value);
                                                setValue('city', '');
                                            }}/>
                                )}/>
                </div>
                <div className="field-wrapper">
                    <label className="field-label" htmlFor="city">
                        City
                    </label>
                    <input className="field-input"
                           placeholder="Your City"
                           id="city"
                           type="text"
                           {...register('city')}/>
                </div>
                <div className="field-wrapper">
                    <label className="field-label" htmlFor="address">
                        Address
                    </label>
                    <input className="field-input"
                           placeholder="Your Address"
                           id="address"
                           type="text"
                           {...register('address')}/>
                </div>
                <div className="field-wrapper">
                    <label className="field-label" htmlFor="zipCode">
                        Postal Code
                    </label>
                    <input className={classNames('field-input', {'field-input--error': errors.zipCode})}
                           placeholder="Your Postal Code"
                           id="zipCode"
                           type="text"
                           {...register('zipCode', {required: true, pattern: /^\d{5}(?:[-\s]\d{4})?$/})}/>
                </div>
                <div className="field-wrapper md:col-span-2">
                    <label className="field-label" htmlFor="bio">
                        About You
                    </label>
                    <textarea className="field-input !py-4 !h-[93px]"
                              placeholder="Enter personal bio"
                              id="bio"
                              {...register('about')}/>
                </div>
            </form>
            <button className="btn btn--primary w-full mt-6 !p-0 md:w-[174px] md:ml-auto"
                    onClick={handleSubmit(onSubmit)}>
                Update Profile
            </button>
        </div>
    )
}

export default ProfileDataForm