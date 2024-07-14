function doGet() {
  var spreadsheetNames = ['東京サロン', '京都サロン', '大阪サロン'];
  const SPREAD_SHEET_ID = '1Yl4zvWFSl5g5GjLIN9w3zvtVXg6rL1mxm-G44qUULXQ'
  
  var result = [];

  for (var s = 0; s < spreadsheetNames.length; s++) {
    var sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheetByName(spreadsheetNames[s]);
    var data = sheet.getDataRange().getValues();

    var groupedData = {};

    for (var i = 1; i < data.length; i++) {
      var date = formatDate(data[i][0]);
      var startTime = formatTime(data[i][1]);
      var endTime = formatTime(data[i][2]);
      var reservationStatus = data[i][3];

      if (!groupedData[date]) {
        groupedData[date] = [];
      }

      groupedData[date].push({
        startTime: startTime,
        endTime: endTime,
        reservationStatus: reservationStatus
      });
    }

    var sheetResult = [];
    for (var date in groupedData) {
      sheetResult.push({
        date: date,
        reservations: groupedData[date]
      });
    }

    result.push({
      sheetName: sheet.getName(),
      data: sheetResult
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDate(rawDate) {
  var dateObject = new Date(rawDate);
  var month = dateObject.getMonth() + 1;
  var day = dateObject.getDate();
  var dayOfWeek = getDayOfWeek(dateObject.getDay());
  return month + "月" + day + "日" + "(" + dayOfWeek + ")";
}
function getDayOfWeek(dayIndex) {
  var daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
  return daysOfWeek[dayIndex];
}
// 時間のフォーマット変更関数
function formatTime(rawTime) {
  var timeObject = new Date(rawTime);
  
  // 時と分を取得
  var hours = timeObject.getHours();
  var minutes = timeObject.getMinutes();

  // 一桁の場合は0を追加
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  // 時刻をHH:mm形式にフォーマット
  var formattedTime = hours + ":" + minutes;
  
  return formattedTime;
}