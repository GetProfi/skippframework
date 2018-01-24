import { connect } from 'react-redux';

import ImagesWrapper from 'components/ImagesWrapper';
import {
  removeArrayElement,
  putArrayElement,
  addArrayElement,
} from 'actions/arrayData';
import { syncArrayBlock } from 'actions/sync';

const mapStateToProps = state => ({
  sync: state.sync,
});

const mapDispatchToProps = {
  syncArrayBlock,
  putArrayElement,
  removeArrayElement,
  addArrayElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagesWrapper);
