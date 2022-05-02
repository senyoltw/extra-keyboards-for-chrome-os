var contextID = 0;

var lut = {
  "Convert": "ControlLeft",
  "NonConvert": "ControlLeft"
};
    

chrome.input.ime.onFocus.addListener(
    function(context) {
      contextID = context.contextID;
    }
);

chrome.input.ime.onBlur.addListener(() => {
  contextID = 0;
})


chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      
      if (keyData.type == "keydown") {
        if (lut[keyData.code]) {
          let emit = lut[keyData.code];

          if (emit != null && contextID != 0) {
            chrome.input.ime.sendKeyEvents({
              "contextID": contextID,
              "keyData": emit,
            }, () => {
              if (chrome.runtime.lastError) {
                console.error('Error committing keyData:', chrome.runtime.lastError);
                return;
              }
            });
          }
          handled = true;
        }
      }
      return handled;
});