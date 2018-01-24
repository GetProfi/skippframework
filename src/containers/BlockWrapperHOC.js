import { connect } from 'react-redux';
import BlockWrapper from 'components/BlockWrapper';

import { syncBlockElement } from 'actions/sync';
import { saveBLockElement } from 'actions/blockData';

const mapStateToProps = state => ({
  sync: state.sync,
});

const mapDispatchToProps = {
  syncBlockElement,
  saveBLockElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockWrapper);
