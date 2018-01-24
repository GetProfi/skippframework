import { connect } from 'react-redux';
import ComponentBuilder from 'components/ComponentBuilder';

export default connect((state, ownProps) => ({
  dataModel: state.dataModel,
  ownDataModel: state.dataModel[ownProps.id],
  backend: state.dataModel[ownProps.id].params.backend,
}))(ComponentBuilder);
