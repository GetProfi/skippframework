import { connect } from 'react-redux';
import ArrayWrapper from 'components/ArrayWrapper';

import {
  removeArrayElement,
  putArrayElement,
  addArrayElement,
} from 'actions/arrayData';
import { syncArrayBlock } from 'actions/sync';

const mapStateToProps = (state, ownProps) => ({
  sync: state.sync[ownProps.id],
});

const mapDispatchToProps = {
  syncArrayBlock,
  putArrayElement,
  removeArrayElement,
  addArrayElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArrayWrapper);
