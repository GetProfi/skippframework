import { connect } from 'react-redux';

import ImageCover from 'components/ImageCover';

import { saveBLockElement } from 'actions/blockData';
import { syncBlockElement, createImage } from 'actions/sync';

const mapStateToProps = state => ({
  sync: state.sync,
  dataModel: state.dataModel,
});

const mapDispatchToProps = {
  saveBLockElement,
  syncBlockElement,
  createImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageCover);
