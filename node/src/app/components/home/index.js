'use strict';

import React from 'react';

import HomeItem from 'components/home-item';

const Home = (props) => {
  const { currentPage, dynamic } = props;
  return (
    <main
      id={"page-"+currentPage}>
        {dynamic.content.map((homeItem, index) => {
          return <HomeItem key={`home-item-${index}`} data={homeItem} />;
      })}
    </main>
  );
};

Home.defaultProps = {
  currentPage: '',
  dynamic: {},

};

export default Home;
