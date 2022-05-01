var contextID = -1;
var lastRemappedKeyEvent = undefined;
var ctrlKey = false;

chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

chrome.input.ime.onBlur.addListener(function(context) {
  contextID = -1;
});

function isConvert(keyData) {
   return (keyData.code == "Convert");
};

function isNonConvert(keyData) {
  return (keyData.code == "NonConvert");
};

function isRemappedEvent(keyData) {  
 // hack, should check for a sender ID (to be added to KeyData)
 return lastRemappedKeyEvent != undefined &&
        (lastRemappedKeyEvent.key == keyData.key &&
         lastRemappedKeyEvent.code == keyData.code &&
         lastRemappedKeyEvent.type == keyData.type
        ); // requestID would be different so we are not checking for it  
}

chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      
      if (isRemappedEvent(keyData)) {
        console.log(keyData); // TODO eventually remove
        return false;
      }
      
      
      if (isConvert(keyData)) {
        keyData.code = "ControlLeft";
        keyData.key = "Ctrl";
        keyData.ctrlKey = (keyData.type == "keydown");
        ctrlKey = keyData.ctrlKey;
        keyData.convert = false;
        chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [keyData]});
        lastRemappedKeyEvent = keyData;                                                 handled = true;
      } else if (ctrlKey) {
        keyData.ctrlKey = ctrlKey;
        keyData.convert = false;
        chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [keyData]});
        lastRemappedKeyEvent = keyData;
        handled = true;
      } else if (keyData.convert) {
	keyData.convert = false;
        chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [keyData]});
        lastRemappedKeyEvent = keyData;
        handled = true;
      }

      if (isNonConvert(keyData)) {
        keyData.code = "ControlLeft";
        keyData.key = "Ctrl";
        keyData.ctrlKey = (keyData.type == "keydown");
        ctrlKey = keyData.ctrlKey;
        keyData.nonconvert = false;
        chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [keyData]});
        lastRemappedKeyEvent = keyData;                                                 handled = true;
      } else if (ctrlKey) {
        keyData.ctrlKey = ctrlKey;
        keyData.nonconvert = false;
        chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [keyData]});
        lastRemappedKeyEvent = keyData;
        handled = true;
      } else if (keyData.nonconvert) {
	keyData.nonconvert = false;
        chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [keyData]});
        lastRemappedKeyEvent = keyData;
        handled = true;
      }

      return handled;
});