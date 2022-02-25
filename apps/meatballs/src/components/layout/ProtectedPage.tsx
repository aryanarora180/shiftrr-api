import { client } from 'lib/api/axiosClient';
import { useProfileStore } from 'lib/hooks/useProfileStore';
import React, { useEffect } from 'react';
import shallow from 'zustand/shallow';

type Props = {
  pageProps: any;
};

const ProtectedPage: React.FC<Props> = ({ pageProps, children }) => {
  const { profile, setProfile } = useProfileStore(
    (state) => ({ profile: state.profile, setProfile: state.setProfile }),
    shallow
  );

  useEffect(() => {
    const _getUser = async () => {
      const profile = await client.get('api/user');
      console.table(profile);

      setProfile(profile);
    };

    _getUser();
  }, [setProfile]);

  // TODO: Add Singular layout to cover all cases
  if (pageProps.protected && !profile) {
    console.log(profile);
    return <div>Please Login to view this page.</div>;
  }

  if (
    pageProps.protected &&
    profile &&
    pageProps.profileTypes &&
    pageProps.profileTypes.indexOf(profile.type) === -1
  ) {
    return (
      <div>
        Authorization Error! You do not have credentials required to view this
        page.
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtectedPage;
