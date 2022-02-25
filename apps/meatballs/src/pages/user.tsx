import React, { useEffect } from 'react';
import type { GetStaticProps, NextPage } from 'next';

import { useProfileStore } from 'lib/hooks/useProfileStore';

type Props = {};

export const getStaticProps: GetStaticProps = ({ params }) => {
  return {
    props: {
      protected: true,
      // userTypes: ['user'],
    },
  };
};

const User: NextPage<Props> = (props) => {
  const profile = useProfileStore((state) => state.profile);

  return (
    <>
      <h1 className="text-semibold">User:</h1>
      {JSON.stringify(profile, null, '\t')}
    </>
  );
};

export default User;
