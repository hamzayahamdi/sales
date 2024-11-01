// components
import Spring from '@components/Spring';
import EditButton from '@ui/EditButton';
import {PatternFormat} from 'react-number-format';

// hooks
import {useState} from 'react';

const PaymentMethod = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [cardNumber, setCardNumber] = useState('1234123412344566');
    const [cardHolderName, setCardHolderName] = useState('John Doe');

    const maskedCardNumber = cardNumber.replace(/\d(?=\d{4})/g, 'x');

    return (
        <Spring className="card p-5 min-h-[180px] xs:p-6 md:h-full">
            <div className="flex gap-2.5 items-center justify-between mb-[18px]">
                <h2 className="truncate">Payment Method</h2>
                <EditButton isActive={isEditing} onClick={() => setIsEditing(!isEditing)}/>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 justify-between pb-4 border-b">
                <label className="uppercase font-medium text-xs text-label" htmlFor="cardNumber">
                    Card Number:
                </label>
                <PatternFormat className="bg-transparent xs:text-right"
                               id="cardNumber"
                               readOnly={!isEditing}
                               value={isEditing ? cardNumber : maskedCardNumber}
                               onChange={e => setCardNumber(e.target.value)}
                               format={isEditing ? '#### #### #### ####' : 'xxxx xxxx xxxx ####'}
                               mask=""/>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 pt-4">
                <label className="uppercase font-medium text-xs text-label" htmlFor="cardHolderName">
                    Card Holder Name:
                </label>
                <input className="bg-transparent xs:text-right"
                       type="text"
                       id="cardHolderName"
                       value={cardHolderName}
                       onChange={e => setCardHolderName(e.target.value)}
                       readOnly={!isEditing}/>
            </div>
        </Spring>
    )
}

export default PaymentMethod