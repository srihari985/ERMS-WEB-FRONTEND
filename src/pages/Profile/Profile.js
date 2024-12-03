import React, { useContext } from 'react';
import OrganizationProfile from './OrganizationProfile/OrganizationProfile';
import { useAuth } from '../../AuthProvider';

const Profile = () => {
  // Assuming we get the user role from a context or prop
  const { role } = useAuth(); // 'organization', 'manager', 'sales', 'technician'
  
  return (
    <div>
      {role === 'ORGANIZATION' && <OrganizationProfile />}
      {(role === 'MANAGER' || role === 'SALES' || role === 'TECHNICIAN' || role === 'TELECALLER' || role === 'OPERATION_TECH_LEAD' || role === 'SALE_MANAGER' || role === 'HUMAN_RESOURCES' )}
      
    </div>
  );
};

export default Profile;
