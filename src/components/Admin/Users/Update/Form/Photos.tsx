import UploadInput from '@/components/ui/UploadInput';
import { FC } from 'react';
import { UseFormReturn, useController } from 'react-hook-form';
import { AdminUserUpdateSchemaType } from './Schema';

interface AdminUserUpdatePhotosProps {
   form: UseFormReturn<AdminUserUpdateSchemaType, any, any>;
}

const AdminUserUpdatePhotos: FC<AdminUserUpdatePhotosProps> = ({
   form: {
      control,
      formState: { errors },
      trigger,
   },
}) => {
   const {
      field: { value: headShotValue, onChange: headShotOnChange },
   } = useController({ name: 'headShot', control });
   const {
      field: { value: governmentValue, onChange: governmentOnChange },
   } = useController({ name: 'photoIdPhoto', control });
   const {
      field: { value: sstValue, onChange: sstOnChange },
   } = useController({ name: 'otherIdPhoto', control });
   return (
      <>
         <UploadInput
            asFile={true}
            key="headshot"
            label="Headshot"
            accept=".png,.jpg,.jpeg"
            value={headShotValue}
            required={false}
            onChange={headShotOnChange}
            error={errors.headShot}
            router="users"
            trigger={trigger}
         />
         <UploadInput
            asFile={true}
            key="government"
            label="Government ID"
            accept=".png,.jpg,.jpeg"
            value={governmentValue}
            onChange={governmentOnChange}
            error={errors.photoIdPhoto}
            required={false}
            router="users"
            trigger={trigger}
         />
         <UploadInput
            asFile={true}
            key="sst"
            label="SST ID"
            accept=".png,.jpg,.jpeg"
            required={false}
            value={sstValue}
            onChange={sstOnChange}
            error={errors.otherIdPhoto}
            router="users"
            trigger={trigger}
         />
      </>
   );
};

export default AdminUserUpdatePhotos;
