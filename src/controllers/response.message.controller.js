const errorMessage = {
    err_entr_avai: 'some entries were not recorded because they are already available',
    entr_removed: 'the provided entry was removed succesfully',
    entr_updated: 'the provided entry was updated succesfully',
    profile_updated: 'profile was updated succesfully',
    err_entr_not_avai: 'the provided entry was not found',
    is_error: 'there was en error while processing your request',
    uc_message:'user created successfully',
    uc_added_to_hp_message:'user was added to the facility successfully',
    uc_added_to_aSsU_message:'Insurance manager was appended successfully',
    mc_added_to_aSsU_message:'Medication (s) were added to restricted list successfully',
    tc_added_to_aSsU_message:'Test (s) were added to restricted list successfully',
    sc_added_to_aSsU_message:'Service (s) were added to restricted list successfully',
    oc_added_to_aSsU_message:'Operation (s) were added to restricted list successfully',
    ec_added_to_aSsU_message:'Equipment (s) were added to restricted list successfully',
    mc_message:'medicine recorded successfully',
    mupd_message:'medication updated successfully',
    tc_message:'test recorded successfully',
    tupd_message:'test updated successfully',
    ec_message:'equipment recorded successfully',
    eu_message:'equipment updated successfully',
    oc_message:'operation recorded successfully',
    oupd_message:'operation updated successfully',
    sc_message:'service recorded successfully',
    supd_message:'service updated successfully',
    ms_message:'message sent successfully',
    transc_message:'transfer created successfully',
    me_message:'message edited successfully',
    dc_message:'department created successfully',
    dic_message:'disease recorded successfully',
    asuutohp_message:'insurance was added to supported list successfully',
    appoi_appr_message:'appointment approved successfully',
    appoi_decli_message:'appointment declined successfully',
    err_appoi_404_message:'appointment not found',
    ab_message:'appointment booked successfully',
    dec_added_message:'decision(s) added to the session successfully',
    vs_added_message:'vital sign(s) added to the session successfully',
    symp_added_message:'symptom(s) added to the session successfully',
    la_message:'location recorded successfully',
    assu_added_message:'insurance recorded successfully',
    assu_hp_error_message:'the selected insurance is not supported by this hospital',
    assu_user_error_message:'the selected user is not eligible for this assurance',
    assu_added_to_user_message:'insurance assigned to the user successfully',
    assu_st_chng:`user's insurance status changed successfully`,
    FP_added_to_user_message:'Fingerprint data assigned to the user successfully',

    bg_added_to_user_message:'blood group assigned to the user successfully',
    iu_message:'inventory updated successfully',
    uc_error_message:'user not created',
    pAp_message:'payment approved successully',
    mc_error_message:'medicine was not created',
    emp_inassigned_to_hp_error_message:'you are not assigned to a health facility yet',
    emp_inassigned_to_assu_error_message:'you are not assigned to an insurance to manage yet',
    err_open_session : `this action can't be performed on an open session`,
    err_unopen_session : `this action can't be performed on session which is not open`,
    err_closed_session : `this action can't be performed on a closed session`,
    medic_updated_message:'medication info updated successfully',
    lgIn_message: 'logged in successfully',
    _err_assu_404:'insurance not found',
    _err_u_404: 'user not found',
    _err_rel_404: 'relatives not found',
    _err_p_404: 'patient not found',
    _err_sess_404: 'the requested session was not found',
    _err_trans_404: 'the requested transfer was not found',
    _err_med_404: 'medicine(s) not found',
    _err_ope_404: 'operation(s) not found',
    _err_recs_404: 'no records found',

    _err_service_404: 'service(s) not found',
    _err_operation_404: 'operation(s) not found',
    _err_equipment_404: 'equipment(s) not found',
    _err_test_404: 'test(s) not found',
    lgIn_error_message: 'incorrect username or password',
    uNa_error_message: 'the current user is not active',
    _2FA_code_message: 'verification code sent!, check in your mailbox for a verication code',
    _2FA_error_message: 'invalid code',
    _err_forbidden: 'access denied, you are not allowed to perform this action',
    _err_FP_avai: 'the added fingerprint data is already assigned to this patient',
    _err_email_avai: 'the provided email is available please try a new one',
    _err_phone_avai: 'the provided phone is available please try a new one',
    _err_NID_avai: 'the provided national ID is available do you wish to login instead ?',
    _err_uname_avai: 'the provided username is available do you wish to login instead ?',
    _err_hc_404: 'the provided hospital was not found',
    _err_timeout: 'request timeout',

    _err_ms_404: 'the provided medical session was not found',
    _err_unknown: 'Oops an unknown error occured',
    _session_clo_message: 'medical session was closed successfully',
    _session_owner_message: 'session ownership claimed successfully',
    _err_hcp_404: 'the provided healthcare provider  was not found',
    _err_hH_404: 'the provided House holder  was not found',
    _err_hcp_unav: 'the selected healthcare provider  is not available in the selected time',
    session_message:'session created successfully',
    test_added_message:'test(s) added to the session successfully',
    medicine_addedtosession_message:'medicine(s) added to the session successfully',
    operation_addedtosession_message:'operation(s) added to the session successfully',
    comment_addedtosession_message:`session's comment updated successfully`,
    service_addedtosession_message:'service(s) added to the session successfully',
    equipment_addedtosession_message:'equipment(s) added to the session successfully'


}
export default errorMessage