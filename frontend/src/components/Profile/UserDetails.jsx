import { Ban, Check } from 'lucide-react';
import Form from '../Forms/Form';
import FormInput from '../Forms/FormInput';
import Button from '../ui/Button';
import UserImg from './UserImg';
import FormSelect from '../Forms/FormSelect';
import { useUpdateUser } from '@/hooks/useUser';
import MiniLoader from '../ui/MiniLoader';
import DeleteAccountTrigger from './DeleteAccountTrigger';
import DeleteAccount from './DeleteAccount';

function UserDetails({ user }) {
  const { email, name, photo, sex, country, city, zip, phone, address } =
    user || {};
  const { isPending, mutate: update } = useUpdateUser();

  const { url } = photo || {};

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    update(formData);
  };

  return (
    <main className="flex flex-col gap-4">
      <Form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
        <UserImg url={url} />
        <div className="grid  lg:grid-cols-[auto_auto] gap-x-[3em] gap-y-[2em]  md:w-full ">
          <FormInput
            name="name"
            label="full name"
            value={name}
            className=" w-[100%] lg:w-[38em] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal dark:text-black text-white"
          />
          <FormInput
            name="email"
            label="Email Address"
            value={email}
            className="w-[100%] lg:w-[38em] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed outline-none px-2 text-[16px] font-normal"
            disabled={true}
          />
          <FormInput
            name="address"
            label="Home Address"
            value={address}
            rules={{ required: 'Home Address is Required' }}
            className=" w-[100%] lg:w-[38em] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal dark:text-black text-white"
          />
          <FormInput
            name="phone"
            label="Phone Number"
            value={phone}
            rules={{ required: 'Phone Number is Required' }}
            className=" w-[100%] lg:w-[38em] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal dark:text-black text-white"
          />
          <FormSelect
            name="sex"
            label="Sex"
            value={sex}
            rules={{ required: 'Sex Field is required' }}
            className="w-[100%] lg:w-[38em] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed text-primary-600 outline-none px-2 text-[16px] font-normal dark:text-black "
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ]}
          />
          <FormInput
            name="country"
            label="Country"
            value={country}
            rules={{ required: 'Country is Required' }}
            className=" w-[100%] lg:w-[38em] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal dark:text-black text-white"
          />
          <FormInput
            name="city"
            label="City"
            value={city}
            rules={{ required: 'City is Required' }}
            className=" w-[100%] lg:w-[38em] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed outline-none px-2 text-[16px] font-normal dark:text-black text-white"
          />
          <FormInput
            name="zip"
            label="Zip Code"
            value={zip}
            rules={{ required: 'Zip Code is Required' }}
            className=" w-[100%] lg:w-[38em] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal dark:text-black text-white"
          />
        </div>
        <div className="flex justify-center md:justify-end gap-4 mt-3 items-center">
          <Button
            className=" hover:bg-primary-600 outline-none cursor-pointer transition-all ease-linear delay-100 bg-white py-[0.8em] h-[43px] w-[130px] flex items-center gap-3 justify-center rounded-sm font-bold uppercase hover:text-white mb-3 text-gray-700 text-[13px] relative dark:bg-gray-300"
            type="reset"
          >
            <Ban size={16} strokeWidth={2.4} />
            Reset
          </Button>

          <Button
            className=" hover:bg-primary-600 outline-none cursor-pointer transition-all ease-linear delay-100 bg-primary-100 py-[0.8em] h-[43px] w-[130px] flex items-center gap-3 rounded-sm font-bold uppercase hover:text-white mb-3 text-white text-[13px] relative"
            type="submit"
          >
            {isPending ? (
              <MiniLoader />
            ) : (
              <h2 className="flex items-center gap-3 justify-center w-full">
                {' '}
                <Check size={16} color="white" strokeWidth={2.4} />
                Save
              </h2>
            )}
          </Button>
        </div>
      </Form>
      <DeleteAccountTrigger />
      <DeleteAccount />
    </main>
  );
}

export default UserDetails;
