import {fork, all} from 'redux-saga/effects';
import { getAllDoctorDetailsSaga, getConfigurationSaga, getFetchDataSaga, getLoginAttemptSaga, getVerifyLoginOtpSaga, getVerifyOtpSaga } from './Pages/Home/HomeRedux/saga';

export default function* rootSaga() {
    yield all([
        fork(getFetchDataSaga),
        fork(getAllDoctorDetailsSaga),
        fork(getLoginAttemptSaga),
        fork(getVerifyOtpSaga),
        fork(getConfigurationSaga),
        fork(getVerifyLoginOtpSaga)
    ]);
}