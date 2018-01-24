import React from 'react';
import PropTypes from 'prop-types';

import ArrayWrapper from 'containers/ArrayWrapperHOC';
import BlockWrapper from 'containers/BlockWrapperHOC';
import ImagesWrapper from 'containers/ImagesWrapperHOC';

const ComponentBuilder = ({ id, children, ownDataModel, ...props }) => {
  if (ownDataModel && ownDataModel.type) {
    let Decorator;

    if (ownDataModel.type === 'array') {
      Decorator = ArrayWrapper;
    }

    if (ownDataModel.type === 'block') {
      Decorator = BlockWrapper;
    }

    if (ownDataModel.type === 'image') {
      Decorator = ImagesWrapper;
    }

    return (
      <Decorator id={id} params={ownDataModel.params} {...props} fromLib="true">
        {children}
      </Decorator>
    );
  }

  return <div>Loading...</div>;
};

ComponentBuilder.propTypes = {
  id: PropTypes.string.isRequired
};

export default ComponentBuilder;
