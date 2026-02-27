import LabourCostSummary from '@/src/component/vendors/Reports/Vendorspendsummary'
import ReportsAnalytics from '@/src/component/vendors/Reports/ReportsAnalytics'
import VendorAnalyticsCharts from '@/src/component/vendors/Reports/VendorAnalyticsCharts'
import React from 'react'
import ContractRenewalAlerts from '@/src/component/vendors/Reports/ContractRenewalAlerts'

const page = () => {
  return (
    <div>
      <ReportsAnalytics/>
      <LabourCostSummary/>
      <VendorAnalyticsCharts/>
      <ContractRenewalAlerts/>
    </div>
  )
}

export default page
