const appKey = 'bhmapp';

export const WebApiURL = {
    login: {
        doLogin: `${appKey}/login`
    },
    dashBoard: {
        dashBoardList: `${appKey}/locationdata`,
        addLocation: `${appKey}/location_save`,
        editLocation: `${appKey}/location_update`,
        deleteLocation: `${appKey}/location_delete`,
        location: `${appKey}/location`,
        totalBatteries: `${appKey}/totalbatteries`,
        batteryDetails: `${appKey}/batterydata`,
        getReports: `${appKey}/getreportdetails`,
        getReportData: `${appKey}/getreportdata`,
        getChartData: `${appKey}/getchartdata`,
        getnotification: `${appKey}/get_notification`,
        downloadReports: `${appKey}/downloadreport`
    }
};

export const serverURL = {
    //URL: 'http://ec2-18-216-174-85.us-east-2.compute.amazonaws.com:3000/'
    URL: 'http://45.79.121.63:3100/'
};
