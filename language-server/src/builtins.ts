// Auto-generated from resources/winccoa-functions-cleaned.json
// DO NOT EDIT MANUALLY - run 'npm run build:functions' instead
// Generated: 2026-01-04T15:38:53.740Z
// Total Functions: 983

// WinCC OA Built-in Functions
export interface FunctionSignature {
    name: string;
    returnType: string;
    parameters: Array<{
        name: string;
        type: string;
        optional?: boolean;
        variadic?: boolean;
        byRef?: boolean;
    }>;
    description?: string;
    deprecated?: boolean;
    docUrl?: string;
}

export const BUILTIN_FUNCTIONS: Map<string, FunctionSignature> = new Map([
    ['abortFileTransfer', {
        name: 'abortFileTransfer',
        returnType: 'int',
        parameters: [{ name: 'manId', type: 'int' }],
        description: 'The function abortFileTransfer() aborts all file transfers of the stated manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/abortFileTransfer.html'
    }],
    ['abs', {
        name: 'abs',
        returnType: 'int',
        parameters: [{ name: 'value', type: 'int' }],
        description: 'Returns the absolute value of a value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/abs.html'
    }],
    ['access', {
        name: 'access',
        returnType: 'int',
        parameters: [{ name: 'path', type: 'string' }, { name: 'amode', type: 'int' }],
        description: 'Queries the access mode of the file or directory with the specified path name.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/access.html'
    }],
    ['acGetRefACType', {
        name: 'acGetRefACType',
        returnType: 'string',
        parameters: [{ name: 'dpeName', type: 'string' }, { name: 'refType', type: 'string', byRef: true }],
        description: 'Returns a AC type name, if the leaf dpeName is referenced to an AC type, otherwise an empty string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/acGetRefACType.html'
    }],
    ['acos', {
        name: 'acos',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Returns the arc cosine in the radian measure.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/acos.html'
    }],
    ['activateMode', {
        name: 'activateMode',
        returnType: 'void',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'Switches the module to normal operating mode.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/activateMode.html'
    }],
    ['addGlobal', {
        name: 'addGlobal',
        returnType: 'int',
        parameters: [{ name: 'name', type: 'string' }, { name: 'type', type: 'unsigned' }],
        description: 'Creates a variable and makes it into a manager-wide variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/addGlobal.html'
    }],
    ['addGroupPVSS', {
        name: 'addGroupPVSS',
        returnType: 'int',
        parameters: [{ name: 'osID', type: 'string' }, { name: 'groupName', type: 'string' }, { name: 'fullName', type: 'langString' }, { name: 'comment', type: 'langString' }],
        description: 'Adds a user group of an external authentication system to the WinCC OA user administration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/addGroupPVSS.html'
    }],
    ['addUserPVSS', {
        name: 'addUserPVSS',
        returnType: 'int',
        parameters: [{ name: 'osID', type: 'string' }, { name: 'userName', type: 'string' }, { name: 'fullName', type: 'langString' }, { name: 'comment', type: 'langString' }],
        description: 'Adds a user of an external authentication system to the WinCC OA user administration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/addUserPVSS.html'
    }],
    ['addUserToGroupPVSS', {
        name: 'addUserToGroupPVSS',
        returnType: 'bool',
        parameters: [{ name: 'userID', type: 'unsigned' }, { name: 'groupID', type: 'unsigned' }],
        description: 'Adds a WinCC OA user to a user group in the WinCC OA user administration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/addUserToGroupPVSS.html'
    }],
    ['addSymbol', {
        name: 'addSymbol',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'shape panel | (string' }, { name: 'panelName', type: 'string' }],
        description: 'Adds a panel reference in a panel or layout at a later time during run time. To suppress the Initialize scripts of the reference the function createSymbol() can be used instead.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/addSymbol.html'
    }],
    ['afterLogin', {
        name: 'afterLogin',
        returnType: 'void',
        parameters: [{ name: 'user', type: 'string' }, { name: 'password', type: 'string' }, { name: 'newLocale', type: 'string' }, { name: 'closeModules', type: 'int' }, { name: 'panel', type: 'string', optional: true }, { name: 'module', type: 'string', optional: true }, { name: 'dollar', type: '[dyn_string' }],
        description: 'After successful login displays the required panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/afterLogin.html'
    }],
    ['alertConnect', {
        name: 'alertConnect',
        returnType: 'int',
        parameters: [{ name: 'object', type: 'class', optional: true }, { name: 'work', type: 'string|function_ptr' }, { name: 'answer', type: 'bool', optional: true }, { name: 'alert1', type: 'string' }, { name: 'alert_list', type: 'string alert2...|dyn_string', optional: true }],
        description: 'Registers the function work() for call with resulting alerts.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/alertConnect.html'
    }],
    ['alertDisconnect', {
        name: 'alertDisconnect',
        returnType: 'int',
        parameters: [{ name: 'object', type: 'class', optional: true }, { name: 'work', type: 'string|function_ptr' }, { name: 'alert1', type: 'string' }, { name: 'alert_list', type: 'string alert2...|dyn_string', optional: true }],
        description: 'Unregisters the function work() from call when changes are made to the values.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/alertDisconnect.html'
    }],
    ['alertGet', {
        name: 'alertGet',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }, { name: 'count', type: 'int' }, { name: 'dp', type: 'string' }, { name: 'value', type: 'anytype', byRef: true }, { name: 't2', type: 'time' }, { name: 'count2', type: 'int' }, { name: 'dp2', type: 'string' }, { name: 'value2', type: 'anytype', byRef: true }],
        description: 'Queries only the last alert attributes of a datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/alertGet.html'
    }],
    ['alertGetPeriod', {
        name: 'alertGetPeriod',
        returnType: 'int',
        parameters: [{ name: 't1', type: 'time' }, { name: 't2', type: 'time' }, { name: '×', type: 'dyn_time' }, { name: 'counts', type: 'dyn_int', byRef: true }, { name: 'alert1', type: 'string' }, { name: 'dpa1', type: 'dyn_string', byRef: true }, { name: 'val1', type: '< dyn_type1 >', byRef: true }, { name: 'alert2', type: 'string' }, { name: 'dpa2', type: 'dyn_string', byRef: true }, { name: 'val2...]', type: '< dyn_type2 >', byRef: true }],
        description: 'Reads the values of the specified alert attributes of the datapoint elements for which alerts were triggered.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/alertGetPeriod.html'
    }],
    ['alertSet', {
        name: 'alertSet',
        returnType: 'int',
        parameters: [{ name: 't1', type: 'time' }, { name: 'count1', type: 'int' }, { name: 'dp1', type: 'string' }, { name: '[', type: 'anytype value1' }, { name: 't2', type: 'time' }, { name: ']', type: '...' }],
        description: 'Allows datapoint attributes to be set in a similar way to dpSet().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/alertSet.html'
    }],
    ['alertSetTimed', {
        name: 'alertSetTimed',
        returnType: 'int',
        parameters: [{ name: 'alerttime', type: 'time' }, { name: 't1', type: 'time' }, { name: 'count1', type: 'int' }, { name: 'dp1', type: 'string' }, { name: 'value1[', type: 'anytype' }, { name: 't2', type: 'time' }, { name: ']', type: '...' }],
        description: 'Allows datapoint attributes to be set in a similar way to dpSet(). Additionally the timestamp can be set manually.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/alertSetTimed.html'
    }],
    ['alertSetTimedWait', {
        name: 'alertSetTimedWait',
        returnType: 'int',
        parameters: [{ name: 'alerttime', type: 'time' }, { name: 't1', type: 'time' }, { name: 'count1', type: 'int' }, { name: 'dp1', type: 'string' }, { name: 'value1[', type: 'anytype' }, { name: 't2', type: 'time' }, { name: ']', type: '...' }],
        description: 'Allows datapoint attributes to be set in a similar way to dpSet(). Additionally the timestamp can be set manually.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/alertSetTimedWait.html'
    }],
    ['alertSetWait', {
        name: 'alertSetWait',
        returnType: 'int',
        parameters: [{ name: 't1', type: 'time' }, { name: 'count1', type: 'int' }, { name: 'dp1', type: 'string' }, { name: '[', type: 'anytype value1' }, { name: 't2', type: 'time' }, { name: ']', type: '...' }],
        description: 'Allows datapoint attributes to be set in a similar way to alertSet()/dpSetWait().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/alertSetWait.html'
    }],
    ['animate', {
        name: 'animate',
        returnType: 'int',
        parameters: [{ name: 'parent', type: 'int', optional: true }, { name: 'object', type: 'string|shape' }, { name: 'attribute', type: 'string' }, { name: 'startValue', type: '<type>' }, { name: '[', type: '<type> endValue' }, { name: 'options]', type: 'mapping' }],
        description: 'With the function animate() you can create animations.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/animate.html'
    }],
    ['asin', {
        name: 'asin',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Returns the arc sine in the radian measure.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/asin.html'
    }],
    ['atan', {
        name: 'atan',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Returns the arc tangent in the radian measure.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/atan.html'
    }],
    ['atan2', {
        name: 'atan2',
        returnType: 'float',
        parameters: [{ name: 'y', type: 'float' }, { name: 'x', type: 'float' }],
        description: 'Returns the arc tangent of the Cartesian coordinates y and x.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/atan2.html'
    }],
    ['availableCameras', {
        name: 'availableCameras',
        returnType: 'dyn_mapping',
        parameters: [{ name: 'position', type: 'string' }],
        description: 'This function shows the cameras available on the system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/availableCameras.html'
    }],
    ['base64Decode', {
        name: 'base64Decode',
        returnType: 'int',
        parameters: [{ name: 'encoded', type: 'string' }, { name: 'decoded', type: 'string|blob', byRef: true }],
        description: 'Decodes base64 encoded data.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/base64Decode.html'
    }],
    ['base64Encode', {
        name: 'base64Encode',
        returnType: 'string',
        parameters: [{ name: 'data', type: 'string|blob' }],
        description: 'Encodes data in the base64 encoding.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/base64Encode.html'
    }],
    ['baseName', {
        name: 'baseName',
        returnType: 'string',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The function returns the last part of a file path.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/baseName.html'
    }],
    ['beep', {
        name: 'beep',
        returnType: 'int',
        parameters: [{ name: 'frequency[', type: '[int' }, { name: 'duration]]', type: 'int' }],
        description: 'Issues a beep.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/beep.html'
    }],
    ['bitmapEditor', {
        name: 'bitmapEditor',
        returnType: 'int',
        parameters: [{ name: 'bitmap[', type: 'idispatch', byRef: true }, { name: 'result', type: 'int', optional: true, byRef: true }, { name: 'colors', type: 'dyn_string', optional: true }, { name: 'size]]', type: 'dyn_int' }],
        description: 'This function opens the bitmap editor. To be able to use the function, the PVSSBitmapEditor.dll has to exist in the directory <version_path>/bin (obsolete from version 3.5 up).',
        deprecated: true,
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/bitmapEditor.html'
    }],
    ['blobAppendValue', {
        name: 'blobAppendValue',
        returnType: 'int',
        parameters: [{ name: 'target', type: 'blob', byRef: true }, { name: 'value', type: 'anytype' }, { name: 'len[', type: 'int' }, { name: 'bigEndian]', type: 'bool' }],
        description: 'Works like blobSetValue(), but the value is appended to the blob.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/blobAppendValue.html'
    }],
    ['blobGetValue', {
        name: 'blobGetValue',
        returnType: 'int',
        parameters: [{ name: 'source', type: 'blob' }, { name: 'offset', type: 'int' }, { name: 'value', type: 'type', byRef: true }, { name: 'len[', type: 'int' }, { name: 'bigEndian]', type: 'bool' }],
        description: 'Reads "value" from byte offset "offset" with "len" bytes from blob.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/blobGetValue.html'
    }],
    ['blobRead', {
        name: 'blobRead',
        returnType: 'int',
        parameters: [{ name: 'target', type: 'blob', byRef: true }, { name: 'len', type: 'int' }, { name: 'fd', type: 'file' }],
        description: 'The function blobRead() reads the content of a file into a blob variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/blobRead.html'
    }],
    ['bloblen', {
        name: 'bloblen',
        returnType: 'int',
        parameters: [{ name: 'target', type: 'blob' }],
        description: 'The function returns the length of a blob in bytes.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/bloblen.html'
    }],
    ['blobSetValue', {
        name: 'blobSetValue',
        returnType: 'int',
        parameters: [{ name: 'target', type: 'blob', byRef: true }, { name: 'offset', type: 'int' }, { name: 'value', type: 'type' }, { name: 'len[', type: 'int' }, { name: 'bigEndian]', type: 'bool' }],
        description: 'Writes "value" from byte position "offset" with "len" bytes to the blob.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/blobSetValue.html'
    }],
    ['blobWrite', {
        name: 'blobWrite',
        returnType: 'int',
        parameters: [{ name: 'source', type: 'blob' }, { name: 'fd', type: 'file' }],
        description: 'The function blobWrite writes the content of a blob variable into a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/blobWrite.html'
    }],
    ['blobZero', {
        name: 'blobZero',
        returnType: 'int',
        parameters: [{ name: 'target', type: 'blob', byRef: true }, { name: 'len', type: 'int' }],
        description: 'Sets blob length to len bytes and initialize the blob with "0".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/blobZero.html'
    }],
    ['byteSizeToString', {
        name: 'byteSizeToString',
        returnType: 'string',
        parameters: [{ name: 'fByteSize', type: 'float' }],
        description: 'Converts a filesize in bytes to a string (for example, with getFileSize()).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/byteSizeToString.html'
    }],
    ['callFunction', {
        name: 'callFunction',
        returnType: 'anytype',
        parameters: [{ name: 'funcName[', type: 'string' }],
        description: 'Calls a specific function. The parameters of the called function are passed as parameters in callFunction().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/callFunction.html'
    }],
    ['cameraCaptureImage', {
        name: 'cameraCaptureImage',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string' }],
        description: 'Capture an image and save it to file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cameraCaptureImage.html'
    }],
    ['cameraIsReadyForCapture', {
        name: 'cameraIsReadyForCapture',
        returnType: 'bool',
        parameters: [],
        description: 'Checks if the camera is ready to capture an image.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cameraIsReadyForCapture.html'
    }],
    ['cameraStart', {
        name: 'cameraStart',
        returnType: 'void',
        parameters: [],
        description: 'Starts the camera.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cameraStart.html'
    }],
    ['cameraStartDetectBarcode', {
        name: 'cameraStartDetectBarcode',
        returnType: 'int',
        parameters: [{ name: 'decoderFormat', type: 'string' }],
        description: 'Starts the detection of a barcode in the camera feed',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cameraStartDetectBarcode.html'
    }],
    ['cameraStop', {
        name: 'cameraStop',
        returnType: 'void',
        parameters: [],
        description: 'Stops the camera.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cameraStop.html'
    }],
    ['cameraStartDetectBarcode', {
        name: 'cameraStartDetectBarcode',
        returnType: 'void',
        parameters: [],
        description: 'Stops the barcode detection.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cameraStopDetectBarcode.html'
    }],
    ['cameraToUse', {
        name: 'cameraToUse',
        returnType: 'void',
        parameters: [{ name: 'deviceName', type: 'string' }],
        description: 'Use the default system camera',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cameraToUse.html'
    }],
    ['captureScreen() - obsolete', {
        name: 'captureScreen() - obsolete',
        returnType: 'void',
        parameters: [],
        description: 'Returns an IDispatch (IPicture) image of the screen. (obsolete from version 3.5).',
        deprecated: true,
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/captureScreen.html'
    }],
    ['ceil', {
        name: 'ceil',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Rounds up to an integer.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ceil.html'
    }],
    ['certificateAcceptPermanently', {
        name: 'certificateAcceptPermanently',
        returnType: 'int',
        parameters: [{ name: 'digest', type: 'string' }],
        description: 'The function marks the given digest as "permanently accepted" and stores this information on the hard disk.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/certificateAcceptPermanently.html'
    }],
    ['certificateIsPermanentlyAccepted', {
        name: 'certificateIsPermanentlyAccepted',
        returnType: 'bool',
        parameters: [{ name: 'digest', type: 'string' }],
        description: 'The function certificateIsPermanentlyAccepted() returns TRUE if the given certificate was already permanently accepted, e.g. by the user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/certificateIsPermanentlyAccepted.html'
    }],
    ['changeLang', {
        name: 'changeLang',
        returnType: 'void',
        parameters: [{ name: 'newLang', type: 'string' }],
        description: 'Function for switching the language at runtime in a user interface.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/changeLang.html'
    }],
    ['checkPassword', {
        name: 'checkPassword',
        returnType: 'bool',
        parameters: [{ name: 'id', type: 'unsigned' }, { name: 'passwd', type: 'string' }],
        description: 'Checks the assignment of a password to the user id.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/checkPassword.html'
    }],
    ['checkPattern', {
        name: 'checkPattern',
        returnType: 'int',
        parameters: [{ name: 'aBitVar', type: 'bit32' }, { name: 'pattern', type: 'string' }],
        description: 'Compares a bit32/bit64 variable with a pattern.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/checkPattern.html'
    }],
    ['checkQuery', {
        name: 'checkQuery',
        returnType: 'int',
        parameters: [{ name: 'aQuery', type: 'string' }],
        description: 'Checks the syntax of a query.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/checkQuery.html'
    }],
    ['checkScript', {
        name: 'checkScript',
        returnType: 'bool',
        parameters: [{ name: 'scriptstr[', type: 'string' }, { name: 'errorPos', type: 'int', byRef: true }],
        description: 'Checks the syntax of a script.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/checkScript.html'
    }],
    ['checkStringFormat', {
        name: 'checkStringFormat',
        returnType: 'bool',
        parameters: [{ name: 'value', type: 'string' }, { name: 'format', type: 'string' }],
        description: 'The function checks, wether the string \'value\' is according the format in \'format\' (for example, "%5.4f").',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/checkStringFormat.html'
    }],
    ['ChildPanelOn', {
        name: 'ChildPanelOn',
        returnType: 'void',
        parameters: [],
        description: 'Opens a child panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOn.html'
    }],
    ['ChildPanelOnCentral', {
        name: 'ChildPanelOnCentral',
        returnType: 'void',
        parameters: [],
        description: 'Opens a child panel centered in the calling parent panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnCentral.html'
    }],
    ['ChildPanelOnCentralModal', {
        name: 'ChildPanelOnCentralModal',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }],
        description: 'Opens a modal child panel centered in the calling parent panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnCentralModal.html'
    }],
    ['ChildPanelOnCentralModalReturn', {
        name: 'ChildPanelOnCentralModalReturn',
        returnType: 'void',
        parameters: [],
        description: 'Opens a modal child panel, with return value, centered in the calling parent panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnCentralModalReturn.html'
    }],
    ['ChildPanelOnCentralReturn', {
        name: 'ChildPanelOnCentralReturn',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'resultFloatdyn_string', type: 'dyn_float', byRef: true }, { name: 'timeout', type: 'time' }],
        description: 'Opens a child panel with return value centered in the calling parent panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnCentralReturn.html'
    }],
    ['ChildPanelOnModal', {
        name: 'ChildPanelOnModal',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }],
        description: 'Opens a modal child panel at the position x, y.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnModal.html'
    }],
    ['ChildPanelOnModalReturn', {
        name: 'ChildPanelOnModalReturn',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }, { name: 'resultFloat', type: 'dyn_float', byRef: true }, { name: 'resultText', type: 'dyn_string', byRef: true }, { name: 'timeout', type: 'time' }],
        description: 'Opens a modal child panel with return values at the position x,y.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnModalReturn.html'
    }],
    ['ChildPanelOnModule', {
        name: 'ChildPanelOnModule',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'ModuleName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }],
        description: 'Opens a child panel in an arbitrary module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnModule.html'
    }],
    ['ChildPanelOnModuleCheckPos', {
        name: 'ChildPanelOnModuleCheckPos',
        returnType: 'void',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'panelName', type: 'string' }, { name: 'moduleName', type: 'string' }, { name: 'parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }],
        description: 'Opens a child panel and also checks the validity of the position and size.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnModuleCheckPos.html'
    }],
    ['ChildPanelOnModuleModal', {
        name: 'ChildPanelOnModuleModal',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'ModuleName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }],
        description: 'Opens a modal child panel in the module " ModuleName".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnModuleModal.html'
    }],
    ['ChildPanelOnModuleModalReturn', {
        name: 'ChildPanelOnModuleModalReturn',
        returnType: 'void',
        parameters: [],
        description: 'Opens a modal child panel in the module " ModuleName " with a return value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnModuleModalReturn.html'
    }],
    ['ChildPanelOnModuleReturn', {
        name: 'ChildPanelOnModuleReturn',
        returnType: 'void',
        parameters: [],
        description: 'Opens a child panel in the module " ModuleName " with return values.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnModuleReturn.html'
    }],
    ['ChildPanelOnParent', {
        name: 'ChildPanelOnParent',
        returnType: 'void',
        parameters: [],
        description: 'Opens a child panel in the specified panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnParent.html'
    }],
    ['ChildPanelOnParentModal', {
        name: 'ChildPanelOnParentModal',
        returnType: 'void',
        parameters: [],
        description: 'Opens a modal child panel in the specified panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnParentModal.html'
    }],
    ['ChildPanelOnParentModalReturn', {
        name: 'ChildPanelOnParentModalReturn',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'ParentName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }, { name: 'resultFloat', type: 'dyn_float', byRef: true }, { name: 'resultText', type: 'dyn_string', byRef: true }, { name: 'timeout', type: 'time' }],
        description: 'Opens a modal child panel in the specified panel with return values.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnParentModalReturn.html'
    }],
    ['ChildPanelOnParentReturn', {
        name: 'ChildPanelOnParentReturn',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'ParentName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }, { name: 'resultFloat', type: 'dyn_float', byRef: true }, { name: 'resultText', type: 'dyn_string', byRef: true }, { name: 'timeout', type: 'time' }],
        description: 'Opens a child panel in the specified panel with return values.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnParentReturn.html'
    }],
    ['ChildPanelOnRelativ', {
        name: 'ChildPanelOnRelativ',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }],
        description: 'Opens a child panel relative to the calling object.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnRelativ.html'
    }],
    ['ChildPanelOnRelativModal', {
        name: 'ChildPanelOnRelativModal',
        returnType: 'void',
        parameters: [],
        description: 'Opens a modal child panel relative to the calling object.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnRelativModal.html'
    }],
    ['ChildPanelOnRelativModalReturn', {
        name: 'ChildPanelOnRelativModalReturn',
        returnType: 'void',
        parameters: [],
        description: 'Opens a modal child panel relative to the calling object, with a return value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnRelativModalReturn.html'
    }],
    ['ChildPanelOnRelativReturn', {
        name: 'ChildPanelOnRelativReturn',
        returnType: 'void',
        parameters: [],
        description: 'Opens a child panel with a return value, relative to the calling object.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnRelativReturn.html'
    }],
    ['ChildPanelOnReturn', {
        name: 'ChildPanelOnReturn',
        returnType: 'void',
        parameters: [],
        description: 'Opens a child panel with return values.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelOnReturn.html'
    }],
    ['ChildPanelReturnValue', {
        name: 'ChildPanelReturnValue',
        returnType: 'void',
        parameters: [{ name: 'FileName', type: 'string' }, { name: 'PanelName', type: 'string' }, { name: 'ParentName', type: 'string' }, { name: 'ModuleName', type: 'string' }, { name: 'Parameter', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }, { name: 'resultFloat', type: 'dyn_float', byRef: true }, { name: 'resultText', type: 'dyn_string', byRef: true }, { name: 'type', type: 'int' }, { name: 'timeout', type: 'time' }],
        description: 'Opens a child panel of a particular type with a return value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/ChildPanelReturnValue.html'
    }],
    ['clearLastError', {
        name: 'clearLastError',
        returnType: 'int',
        parameters: [],
        description: 'Allows to clear the last error which has been raised in WinCC OA.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/clearLastError.html'
    }],
    ['closeDialog', {
        name: 'closeDialog',
        returnType: 'int',
        parameters: [{ name: '[', type: '[bool complexPara' }, { name: 'result]', type: 'mapping' }],
        description: 'Closes its own dialog for simple configuration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/closeDialog.html'
    }],
    ['closeProgressBar', {
        name: 'closeProgressBar',
        returnType: 'void',
        parameters: [],
        description: 'The function closes the module for the progress bar.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/closeProgressBar.html'
    }],
    ['colorDbIsWritable', {
        name: 'colorDbIsWritable',
        returnType: 'bool',
        parameters: [],
        description: 'The function returns True when UI manager may change the colorDB.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorDblsWritable.html'
    }],
    ['colorEditor', {
        name: 'colorEditor',
        returnType: 'int',
        parameters: [{ name: 'colstr', type: 'string', byRef: true }, { name: 'allColors', type: 'bool' }],
        description: 'Opens the color editor and writes the names of the color to colstr.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorEditor.html'
    }],
    ['colorGet', {
        name: 'colorGet',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'colorName', type: 'string' }, { name: 'colorDefinition', type: 'string', byRef: true }],
        description: 'A color scheme is a collection of colorDB files located in a subdirectory of proj_path/colorDB, for example, WinCC_OA_proj_path/colorDB/DayScheme/colors. Hence, the name of the schema is "DaySchema" - the name of the directory. The function colorGet() returns a blink or an RGB definition of a color from a desired colorDB file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorGet.html'
    }],
    ['colorGetActiveScheme', {
        name: 'colorGetActiveScheme',
        returnType: 'string',
        parameters: [],
        description: 'A color scheme is a collection of colorDB files located in a subdirectory of proj_path/colorDB, for example, proj_path/colorDB/DayScheme/colors. Hence, the name of the schema is "DaySchema" - the name of the directory. The function colorGetActiveScheme returns the active color scheme.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorGetActiveScheme.html'
    }],
    ['colorGetAlias', {
        name: 'colorGetAlias',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'alias', type: 'string' }, { name: 'colorName', type: 'string', byRef: true }],
        description: 'A color scheme is a collection of colorDB files located in a subdirectory of proj_path/colorDB, for example, WinCC_OA_proj_path/colorDB/DayScheme/colors. Hence, the name of the schema is "DaySchema" - the name of the directory. The function colorGetAlias() returns the color name of an alias from a desired colorDB file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorGetAlias.html'
    }],
    ['colorRemove', {
        name: 'colorRemove',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'colorName', type: 'string' }],
        description: 'A color scheme is a collection of colorDB files located in a subdirectory of proj_path/colorDB, for example, proj_path/colorDB/DayScheme/colors. Hence, the name of the schema is "DayScheme" - the name of the directory. The function "colorRemove" deletes a color or alias definition from a colorDB file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorRemove.html'
    }],
    ['colorSet', {
        name: 'colorSet',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'colorName', type: 'string' }, { name: 'colorDefinition', type: 'string' }],
        description: 'A color scheme is a collection of colorDB files located in a subdirectory of proj_path/colorDB, for example, WinCC_OA_proj_path/colorDB/DayScheme/colors. Hence, the name of the schema is "DaySchema" - the name of the directory. The function colorSet() specifies a color in the specified colorDB file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorSet.html'
    }],
    ['colorSetActiveScheme', {
        name: 'colorSetActiveScheme',
        returnType: 'int',
        parameters: [{ name: 'scheme', type: 'string' }],
        description: 'A color scheme is a collection of colorDB files located in a subdirectory of proj_path/colorDB, for example, proj_path/colorDB/DayScheme/colors. Hence, the name of the schema is "DayScheme" - the name of the directory. The function colorSetActiveScheme sets the active color scheme.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorSetActiveScheme.html'
    }],
    ['colorSetAlias', {
        name: 'colorSetAlias',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'alias', type: 'string' }, { name: 'colorName', type: 'string' }],
        description: 'A color scheme is a collection of colorDB files located in a subdirectory of proj_path/colorDB, for example, WinCC_OA_proj_path/colorDB/DayScheme/colors. Hence, the name of the schema is "DaySchema" - the name of the directory. The function colorSetAlias() specifies an alias for a color in a colorDB file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorSetAlias.html'
    }],
    ['colorToRgb', {
        name: 'colorToRgb',
        returnType: 'int',
        parameters: [{ name: 'color', type: 'string' }, { name: 'red', type: 'int', byRef: true }, { name: 'green', type: 'int', byRef: true }, { name: 'blue', type: 'int', byRef: true }, { name: 'alpha', type: 'int', byRef: true }],
        description: 'The function retrieves the RGB values from the given color.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/colorToRgb.html'
    }],
    ['commonConfirm', {
        name: 'commonConfirm',
        returnType: 'int',
        parameters: [{ name: 'modulName', type: 'string' }],
        description: 'Causes an acknowledge all of all the panels in the module "modulName".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/commonConfirm.html'
    }],
    ['confirmMode', {
        name: 'confirmMode',
        returnType: 'void',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'Switches the module to individual acknowledge mode.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/confirmMode.html'
    }],
    ['connectedShapes', {
        name: 'connectedShapes',
        returnType: 'int',
        parameters: [{ name: 'module', type: 'string' }, { name: 'panel', type: 'string' }],
        description: 'Sets graphics objects where the function dpConnect() is active to a particular color for a certain time. All graphics objects that are connected to DPs are therefore displayed.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/connectedShapes.html'
    }],
    ['convManIdToInt', {
        name: 'convManIdToInt',
        returnType: 'int',
        parameters: [{ name: 'manType', type: 'char' }, { name: '[', type: 'char manNum' }, { name: '[', type: 'int sysNum' }, { name: 'replica]]', type: 'char' }],
        description: 'Returns an integer that corresponds to the ManagerIdentifier.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/convManIdToInt.html'
    }],
    ['convManIntToName', {
        name: 'convManIntToName',
        returnType: 'int',
        parameters: [{ name: 'manIDInt', type: 'int' }, { name: 'manName', type: 'string', byRef: true }, { name: 'bNum', type: 'bool', optional: true }, { name: 'bShort', type: 'bool', optional: true }],
        description: 'Converts an integer, which corresponds to the manager identifier, to manager name.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/convManIntToName.html'
    }],
    ['copyAllFiles', {
        name: 'copyAllFiles',
        returnType: 'bool',
        parameters: [{ name: 'source', type: 'string' }, { name: 'target[', type: 'string' }, { name: 'par3[', type: 'bool' }, { name: 'time]]', type: 'time' }],
        description: 'Copies all the files of the specified directory to a new directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/copyAllFiles.html'
    }],
    ['copyAllFilesRecursive', {
        name: 'copyAllFilesRecursive',
        returnType: 'bool',
        parameters: [{ name: 'source', type: 'string' }, { name: 'target[', type: 'string' }, { name: 'par3[', type: 'bool' }, { name: 'time]]', type: 'time' }],
        description: 'Copies files and subdirectories of a directory to a new directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/copyAllFilesRecursive.html'
    }],
    ['copyFile', {
        name: 'copyFile',
        returnType: 'bool',
        parameters: [{ name: 'source', type: 'string' }, { name: '[', type: 'string target' }, { name: 'par3]', type: 'bool' }],
        description: 'Copies the specified source file to the specified target file or to the specified directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/copyFile.html'
    }],
    ['cos', {
        name: 'cos',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Calculates the cosine.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cos.html'
    }],
    ['cosh', {
        name: 'cosh',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Returns the hyperbolic cosine of an angle.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cosh.html'
    }],
    ['createAnimation', {
        name: 'createAnimation',
        returnType: 'int',
        parameters: [{ name: 'parent', type: 'int', optional: true }, { name: 'type', type: 'string', optional: true }, { name: 'options]', type: 'mapping' }],
        description: 'With the function you can create more complex animations. To create an animation group, call this function.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/createAnimation.html'
    }],
    ['createComObject', {
        name: 'createComObject',
        returnType: 'idispatch',
        parameters: [{ name: '[', type: 'string objName' }, { name: 'bWithEvents', type: 'bool' }, { name: 'postfix]', type: 'string' }],
        description: 'Creates a COM object (also without user interface (not ActiveX)).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/createComObject.html'
    }],
    ['createNotification', {
        name: 'createNotification',
        returnType: 'int',
        parameters: [{ name: 'options', type: 'mapping' }],
        description: 'The function creates a notification.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/createNotification.html'
    }],
    ['createPanel', {
        name: 'createPanel',
        returnType: 'int',
        parameters: [{ name: 'filename', type: 'string' }, { name: 'width', type: 'int' }, { name: 'height', type: 'int' }],
        description: 'Creates an (empty) panel file in a defined size (width and height) named "filename".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/createPanel.html'
    }],
    ['createQRCodeFile', {
        name: 'createQRCodeFile',
        returnType: 'int',
        parameters: [{ name: 'data', type: 'string' }, { name: '[', type: 'string filename' }, { name: 'elementWidth]', type: 'int' }],
        description: 'Creates a QR code file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/createQRCodeFile.html'
    }],
    ['createSymbol', {
        name: 'createSymbol',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'shape panel | (string' }, { name: 'panelName', type: 'string' }],
        description: 'Adds a panel references in a panel or layout at a later time during run time. The function is identical to addSymbol() but prevents the triggering of the added objects initialize scripts.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/createSymbol.html'
    }],
    ['crypt', {
        name: 'crypt',
        returnType: 'string',
        parameters: [{ name: '[', type: 'string text' }, { name: 'isVersion', type: 'int' }, { name: 'iterations', type: 'int' }],
        description: 'Encrypts the transferred text.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/crypt.html'
    }],
    ['cryptoHash', {
        name: 'cryptoHash',
        returnType: 'string',
        parameters: [{ name: 'data', type: 'blob|string' }, { name: 'algorithm', type: 'string' }],
        description: 'Allows to create a checksum for a string or blob element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cryptoHash.html'
    }],
    ['cssLenghtToPixel', {
        name: 'cssLenghtToPixel',
        returnType: 'int',
        parameters: [],
        description: 'Calculates the lenght of a given font in pixel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/cssLengthToPixel.html'
    }],
    ['dataHost', {
        name: 'dataHost',
        returnType: 'dyn_string',
        parameters: [],
        description: 'Returns the host name the Data Manager is running on.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dataHost.html'
    }],
    ['dataPort', {
        name: 'dataPort',
        returnType: 'unsigned',
        parameters: [],
        description: 'Returns the port number of the data manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dataPort.html'
    }],
    ['day', {
        name: 'day',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the day of the month.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/day.html'
    }],
    ['daylightsaving', {
        name: 'daylightsaving',
        returnType: 'void',
        parameters: [],
        description: 'Checks whether the time is winter time or summer time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/daylightsaving.html'
    }],
    ['daySecond', {
        name: 'daySecond',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the seconds of the day.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/daySecond.html'
    }],
    ['dbAddNew', {
        name: 'dbAddNew',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Database function that generates a new, empty data record.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbAddNew.html'
    }],
    ['dbBeginTransaction', {
        name: 'dbBeginTransaction',
        returnType: 'int',
        parameters: [{ name: 'connection', type: 'dbConnection' }],
        description: 'Database function for starting a transaction.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbBeginTransaction.html'
    }],
    ['dbBulkCommand', {
        name: 'dbBulkCommand',
        returnType: 'int',
        parameters: [{ name: 'connection', type: 'dbConnection' }, { name: '[', type: 'string cmdStr' }, { name: 'paramValues]', type: 'dym_dyn_anytype' }],
        description: 'Summarizes the ADO functions dbStartCommand() (prepares a data manipulation command), dbExecuteCommand() (executes a data manipulation command) and dbFinishCommand() (closes a data manipulation command).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbBulkCommand.html'
    }],
    ['dbCloseConnection', {
        name: 'dbCloseConnection',
        returnType: 'int',
        parameters: [{ name: 'connection', type: 'dbConnection' }],
        description: 'Function for closing a connection to a data source.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbCloseConnection.html'
    }],
    ['dbCloseRecordset', {
        name: 'dbCloseRecordset',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Database function for closing a tabular data subset of a data source.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbCloseRecordset.html'
    }],
    ['dbCommitTransaction', {
        name: 'dbCommitTransaction',
        returnType: 'int',
        parameters: [{ name: 'connection', type: 'dbConnection' }],
        description: 'Database function for closing a transaction, changes are implemented.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbCommitTransaction.html'
    }],
    ['dbDelete', {
        name: 'dbDelete',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Database function which deletes the current data record.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbDelete.html'
    }],
    ['dbEOF', {
        name: 'dbEOF',
        returnType: 'bool',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Database function for determining whether the data record pointer has reached the end of the record set.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbEOF.html'
    }],
    ['dbExecuteCommand', {
        name: 'dbExecuteCommand',
        returnType: 'int',
        parameters: [{ name: 'command[', type: 'dbCommand' }, { name: 'rs]', type: 'dbRecordset' }],
        description: 'Database function for executing a database manipulation command.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbExecuteCommand.html'
    }],
    ['dbFinishCommand', {
        name: 'dbFinishCommand',
        returnType: 'int',
        parameters: [{ name: 'command', type: 'dbCommand' }],
        description: 'Database function for releasing a command object.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbFinishCommand.html'
    }],
    ['dbGetError', {
        name: 'dbGetError',
        returnType: 'int',
        parameters: [{ name: 'connection', type: 'dbConnection' }, { name: 'errorCount', type: 'int', byRef: true }, { name: 'errorNumber', type: 'int', byRef: true }, { name: 'errorNative', type: 'int', byRef: true }, { name: 'errorDescription', type: 'string', byRef: true }, { name: 'SQLState', type: 'string', byRef: true }],
        description: 'Database function that returns the currently waiting error codes and messages.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbGetError.html'
    }],
    ['dbGetField', {
        name: 'dbGetField',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }, { name: 'index', type: 'int' }, { name: 'field', type: 'anytype', byRef: true }],
        description: 'Database function which reads a column (field) of the current data record.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbGetField.html'
    }],
    ['dbGetRecord', {
        name: 'dbGetRecord',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }, { name: 'rowContent', type: 'dyn_anytype', byRef: true }],
        description: 'Reads the records from a row.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbGetRecord.html'
    }],
    ['dbGetResult', {
        name: 'dbGetResult',
        returnType: 'void',
        parameters: [],
        description: 'Returns all results of an SQL query.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbGetResult.html'
    }],
    ['dbMove', {
        name: 'dbMove',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }, { name: 'offset', type: 'int' }],
        description: 'Database function which moves the data record pointer to any record in the record set relative to the current position.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbMove.html'
    }],
    ['dbMoveFirst', {
        name: 'dbMoveFirst',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Database function which moves the data record pointer to the first record in the record set.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbMoveFirst.html'
    }],
    ['dbMoveLast', {
        name: 'dbMoveLast',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Database function which moves the data record pointer to the last record in the record set.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbMoveLast.html'
    }],
    ['dbMoveNext', {
        name: 'dbMoveNext',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Database function which moves the data record pointer to the next record in the record set.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbMoveNext.html'
    }],
    ['dbMovePrevious', {
        name: 'dbMovePrevious',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Database function which moves the data record pointer to the previous record in the record set.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbMovePrevious.html'
    }],
    ['dbOpenRecordset', {
        name: 'dbOpenRecordset',
        returnType: 'int',
        parameters: [{ name: 'connection', type: 'dbConnection' }, { name: 'cmdStr', type: 'string' }, { name: 'recordset', type: 'dbRecordset', byRef: true }, { name: 'cursorType]', type: 'int' }],
        description: 'Database function for opening a tabular data subset of a data source.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbOpenRecordset.html'
    }],
    ['dbOpenConnection', {
        name: 'dbOpenConnection',
        returnType: 'int',
        parameters: [{ name: 'connectStr', type: 'string' }, { name: 'connection', type: 'dbConnection', byRef: true }],
        description: 'Database function for opening a connection to a data source.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbOpenConnection.html'
    }],
    ['dbPutField', {
        name: 'dbPutField',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }, { name: 'index', type: 'int' }, { name: 'val', type: 'anytype' }],
        description: 'Database function that changes a column (field) of the current data record.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbPutField.html'
    }],
    ['dbRequery', {
        name: 'dbRequery',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Rereads the data of the record set from the data source.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbRequery.html'
    }],
    ['dbRollbackTransaction', {
        name: 'dbRollbackTransaction',
        returnType: 'int',
        parameters: [{ name: 'connection', type: 'dbConnection' }],
        description: 'To end a transaction, no changes are made.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbRollbackTransaction.html'
    }],
    ['dbSetParameter', {
        name: 'dbSetParameter',
        returnType: 'int',
        parameters: [{ name: 'cmd', type: 'dbCommand' }, { name: 'paramIdentifier', type: 'string' }, { name: 'paramType', type: 'unsigned' }, { name: 'paramValues', type: 'anytype' }],
        description: 'Database function for setting name/value pairs for use as a parameter in the subsequent commands.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbSetParameter.html'
    }],
    ['dbStartCommand', {
        name: 'dbStartCommand',
        returnType: 'int',
        parameters: [{ name: 'connection', type: 'dbConnection' }, { name: 'cmdStr', type: 'string' }, { name: 'command', type: 'dbCommand', byRef: true }],
        description: 'To prepare a data manipulation command.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbStartCommand.html'
    }],
    ['dbUpdate', {
        name: 'dbUpdate',
        returnType: 'int',
        parameters: [{ name: 'recordset', type: 'dbRecordset' }],
        description: 'Writes all the changes made back to the current data record with dbPutField().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dbUpdate.html'
    }],
    ['Debug', {
        name: 'Debug',
        returnType: 'int',
        parameters: [],
        description: 'Evaluates any Control expressions and writes the result to stderr.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/Debug.html'
    }],
    ['decrypt', {
        name: 'decrypt',
        returnType: 'int',
        parameters: [{ name: 'ciphertext', type: 'blob' }, { name: 'passphrase', type: 'string' }, { name: 'plaintext', type: 'string|blob', byRef: true }],
        description: 'Decrypts the specified ciphertext using the specified passphrase.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/decrypt.html'
    }],
    ['DebugFN', {
        name: 'DebugFN',
        returnType: 'int',
        parameters: [{ name: 'dbgFlag', type: 'int|string' }],
        description: 'Evaluates any number of control expressions, if a specific debug flag is set and writes the result to stderr, followed by a new line.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/DebugFN.html'
    }],
    ['DebugFTN', {
        name: 'DebugFTN',
        returnType: 'int',
        parameters: [{ name: 'dbgFlag', type: 'int|string' }],
        description: 'Evaluates any number of control expressions, if a specific debug flag is set and writes the result with a time stamp to stderr followed by a new line.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/DebugFTN.html'
    }],
    ['DebugN', {
        name: 'DebugN',
        returnType: 'int',
        parameters: [],
        description: 'Evaluates any Control expressions and writes the result to stderr, followed by a new line.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/DebugN.html'
    }],
    ['DebugTN', {
        name: 'DebugTN',
        returnType: 'int',
        parameters: [],
        description: 'Like the function DebugN(), but with a time stamp.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/DebugTN.html'
    }],
    ['deg2rad', {
        name: 'deg2rad',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Converts an angle from measurement in degrees to a radian measurement',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/deg2rad.html'
    }],
    ['delay', {
        name: 'delay',
        returnType: 'int',
        parameters: [{ name: '[', type: 'unsigned sec' }, { name: 'milli]', type: 'unsigned' }],
        description: 'Delays the next program step.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/delay.html'
    }],
    ['deleteImageFromCache', {
        name: 'deleteImageFromCache',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string' }],
        description: 'Allows to remove a file from the pixmap cache.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/deleteImageFromCachehtm.html'
    }],
    ['delExt', {
        name: 'delExt',
        returnType: 'void',
        parameters: [],
        description: 'The function deletes the file extension of the specified file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/delExt.html'
    }],
    ['desDecrypt', {
        name: 'desDecrypt',
        returnType: 'int',
        parameters: [{ name: 'src', type: 'blob' }, { name: 'key', type: 'string' }, { name: 'dest', type: 'string|blob', byRef: true }],
        description: 'The function decodes the content of a blob variable using the DES algorithm.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/desDecrypt.html'
    }],
    ['desEncrypt', {
        name: 'desEncrypt',
        returnType: 'int',
        parameters: [{ name: 'src', type: 'string | blob' }, { name: 'key', type: 'string' }, { name: 'dest', type: 'blob', byRef: true }],
        description: 'The function encodes the content of a string or blob variable using the DES algorithm.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/desEncrypt.html'
    }],
    ['dirName', {
        name: 'dirName',
        returnType: 'string',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The function returns the directory path for the specified directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dirName.html'
    }],
    ['dollarSubstitute', {
        name: 'dollarSubstitute',
        returnType: 'string',
        parameters: [{ name: 'toSubstitute', type: 'string' }, { name: 'dollarParams', type: 'dyn_string' }],
        description: 'The function replaces dollar parameters in an expression with the parameters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dollarSubstitute.html'
    }],
    ['dpActivateAlert', {
        name: 'dpActivateAlert',
        returnType: 'void',
        parameters: [{ name: 'dpe', type: 'string' }, { name: 'ok[', type: 'bool', byRef: true }, { name: 'bSetWithNullTime', type: 'bool' }],
        description: 'Activates an alert handling at the given datapoint element either with or without NULL time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpActivateAlert.html'
    }],
    ['dpAliases', {
        name: 'dpAliases',
        returnType: 'dyn_string',
        parameters: [{ name: '[', type: 'string filter' }, { name: 'dpeFilter]', type: 'string' }],
        description: 'Returns all aliases with fitting pattern of filter and (optional) suitable filter dpeFilter of the datapoint elements.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpAliases.html'
    }],
    ['dpAliasToName', {
        name: 'dpAliasToName',
        returnType: 'string',
        parameters: [{ name: 'alias', type: 'string' }],
        description: 'Returns the datapoint element for the given alias.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpAliasToName.html'
    }],
    ['dpAttributeType', {
        name: 'dpAttributeType',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'Returns the data type.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpAttributeType.html'
    }],
    ['dpCancelSplitRequest', {
        name: 'dpCancelSplitRequest',
        returnType: 'int',
        parameters: [{ name: 'reqId', type: 'int' }],
        description: 'If a query takes very long, use the function dpCancelSplitRequest in order to cancel the query function.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpCancelSplitRequest.html'
    }],
    ['dpChange', {
        name: 'dpChange',
        returnType: 'int',
        parameters: [{ name: 'paraName', type: 'string' }, { name: 'dp', type: 'string' }],
        description: 'The function opens a datapoint in the PARA module in change mode.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpChange.html'
    }],
    ['dpConnect', {
        name: 'dpConnect',
        returnType: 'void',
        parameters: [],
        description: 'Calls a callback function whenever the passed datapoint values/attributes change.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpConnect.html'
    }],
    ['dpConnectUserData', {
        name: 'dpConnectUserData',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'userData[', type: 'anytype' }, { name: 'answer', type: 'bool' }, { name: 'dpe1[', type: 'string' }, { name: 'dp_list', type: 'string dpe2...] | dyn_string' }],
        description: 'Calls a callback function on data change of the defined datapoint values/attributes and passes them to it. In contrast to dpConnect(), this function allows you to also pass any data to the callback function.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpConnectUserData.html'
    }],
    ['dpCopy', {
        name: 'dpCopy',
        returnType: 'void',
        parameters: [{ name: 'dpSource', type: 'string' }, { name: 'dpDestination', type: 'string' }, { name: 'error', type: 'int', byRef: true }, { name: 'iDriverNumber', type: 'int', optional: true }],
        description: 'Copies a datapoint including the configuration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpCopy.html'
    }],
    ['dpCopyBufferClear', {
        name: 'dpCopyBufferClear',
        returnType: 'void',
        parameters: [],
        description: 'Clears the buffer copies prior to a new dpCopy().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpCopyBufferClear.html'
    }],
    ['dpCopyConfig', {
        name: 'dpCopyConfig',
        returnType: 'void',
        parameters: [{ name: 'dpSource', type: 'string' }, { name: 'dpDestination', type: 'string' }, { name: 'sConfig', type: 'dyn_string' }, { name: 'error', type: 'int', byRef: true }, { name: 'iDriverNumber', type: 'int' }],
        description: 'The function dpCopyConfig() copies a config from a source datapoint element into a target datapoint element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpCopyConfig.html'
    }],
    ['dpCopyConfigMerge', {
        name: 'dpCopyConfigMerge',
        returnType: 'void',
        parameters: [{ name: 'sourceDpe', type: 'string' }, { name: 'destinationDpe', type: 'string' }, { name: 'copyConfigs', type: 'dyn_string' }],
        description: 'dpCopyConfigMerge() copies specific configs from a source datapoint element into a target datapoint element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpCopyConfigMerge.html'
    }],
    ['dpCopyConfigMergeBufferClear', {
        name: 'dpCopyConfigMergeBufferClear',
        returnType: 'void',
        parameters: [],
        description: 'Clears the buffer copies prior to a new dpCopyConfigMerge().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpCopyConfigMergeBufferClear.html'
    }],
    ['dpCopyOriginal', {
        name: 'dpCopyOriginal',
        returnType: 'void',
        parameters: [{ name: 'dpSource', type: 'string' }, { name: 'dpDestination', type: 'string' }, { name: 'error', type: 'int', byRef: true }],
        description: 'Copies the original value of the source datapoint to the target datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpCopyOriginal.html'
    }],
    ['dpCreate', {
        name: 'dpCreate',
        returnType: 'int',
        parameters: [{ name: 'dpname', type: 'string' }, { name: '[', type: 'string dptype' }, { name: 'sysnum', type: 'int' }, { name: 'dpNo]]', type: 'unsigned' }],
        description: 'Creates a datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpCreate.html'
    }],
    ['dpDeactivateAlert', {
        name: 'dpDeactivateAlert',
        returnType: 'void',
        parameters: [{ name: 'dpe', type: 'string' }, { name: 'ok[', type: 'bool', byRef: true }, { name: 'bSetWithNullTime', type: 'bool' }],
        description: 'Deactivates an alert handling at the given datapoint element either with or without NULL time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpDeactivateAlert.html'
    }],
    ['dpDelete', {
        name: 'dpDelete',
        returnType: 'int',
        parameters: [{ name: 'dpname', type: 'string' }],
        description: 'Deletes a datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpDelete.html'
    }],
    ['dpDisconnect', {
        name: 'dpDisconnect',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: '[', type: 'string dp1' }, { name: 'dp_list]', type: 'string dp2...|dyn_string' }],
        description: 'The function unregisters function work().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpDisconnect.html'
    }],
    ['dpDisconnectUserData', {
        name: 'dpDisconnectUserData',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'userData[', type: 'anytype' }, { name: 'dp1[', type: 'string' }, { name: 'dp_list', type: 'string dpe2...] | dyn_string' }],
        description: 'Unregisters a callback function which was called using dpConnectUserData().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpDisconnectUserData.html'
    }],
    ['dpElementType', {
        name: 'dpElementType',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'Returns the data type.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpElementType.html'
    }],
    ['dpExists', {
        name: 'dpExists',
        returnType: 'bool',
        parameters: [{ name: 'dpname', type: 'string' }],
        description: 'The function dpExists() checks the existence of a valid datapoint identifier.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpExists.html'
    }],
    ['dpGet', {
        name: 'dpGet',
        returnType: 'int',
        parameters: [{ name: 'dp1', type: 'string dp1 | dyn_string' }, { name: 'var1', type: '<type1>', byRef: true }, { name: 'dp2', type: 'string' }, { name: 'var2', type: '<type2>', byRef: true }],
        description: 'Reads values of datapoint attributes in variables.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGet.html'
    }],
    ['dpGetAlias', {
        name: 'dpGetAlias',
        returnType: 'dyn_string',
        parameters: [{ name: 'dpName', type: 'string dpName | dyn_string' }],
        description: 'New consistent name for the function dpNameToAlias. The function dpGetAlias() returns the alias for the specified datapoint element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetAlias.html'
    }],
    ['dpGetAllAliases', {
        name: 'dpGetAllAliases',
        returnType: 'int',
        parameters: [{ name: 'dps', type: 'dyn_string', byRef: true }, { name: 'aliases', type: 'dyn_string', byRef: true }, { name: '[', type: 'string aliasFilter' }, { name: 'dpeFilter]]', type: 'string' }],
        description: 'Returns all datapoints and their aliases. For the return of aliases you can also define filters in this function (see description of the parameters below). The function replaces getAllDpAliases() in versions > 2.11.1.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetAllAliases.html'
    }],
    ['dpGetAllAttributes', {
        name: 'dpGetAllAttributes',
        returnType: 'dyn_string',
        parameters: [{ name: 'config', type: 'string' }],
        description: 'Returns all attributes of the config "_config" (for example, of "_original")',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetAllAttributes.html'
    }],
    ['dpGetAllComments', {
        name: 'dpGetAllComments',
        returnType: 'int',
        parameters: [{ name: 'dpe', type: 'dyn_string', byRef: true }, { name: 'comments', type: 'dyn_string', byRef: true }, { name: '[', type: 'string commentFilter' }, { name: '[', type: 'string dpeFilter' }, { name: 'mode]]]', type: 'int' }],
        description: 'The function may not used any longer; replaced by dpGetAllDescriptions(). Returns in dpe all datapoint elements and in comments all comments with a suitable (optional) filter for comments. Further more optional: datapoint elements with fitting filter for datapoint elements',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetAllComments.html'
    }],
    ['dpGetAllDescriptions', {
        name: 'dpGetAllDescriptions',
        returnType: 'int',
        parameters: [{ name: 'dps', type: 'dyn_string', byRef: true }, { name: 'descriptions', type: 'dyn_string', byRef: true }, { name: '[', type: 'string descriptionFilter' }, { name: '[', type: 'string dpeFilter' }, { name: 'mode]]]', type: 'int' }],
        description: 'Returns via dps all datapoints and via descriptions all descriptions that correspond to the descriptionFilter. You can also specify a dpeFilter. This means that only the datapoints containing the specified datapoint element are returned provided that the description of the datapoint element corresponds to the descriptionFilter.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetAllDescriptions.html'
    }],
    ['dpGetAllConfigs', {
        name: 'dpGetAllConfigs',
        returnType: 'dyn_string',
        parameters: [{ name: 'dpe', type: 'string' }],
        description: 'Returns all possible configs, which are allowed to configure to a datapoint element "dpe" resp. to a data type "dpeType(bit, bitarray, structure,...).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetAllConfigs.html'
    }],
    ['dpGetAllDetails', {
        name: 'dpGetAllDetails',
        returnType: 'dyn_string',
        parameters: [{ name: 'config', type: 'string' }],
        description: 'Returns all details of a config (for example, of "_lock").',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetAllDetails.html'
    }],
    ['dpGetAsynch', {
        name: 'dpGetAsynch',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }, { name: 'dp1', type: 'string|dyn_string' }, { name: 'var1', type: '<type1>|<dyn_type1>', byRef: true }, { name: 'dp2', type: 'string|dyn_string' }, { name: 'var2...]', type: '<type2>|<dyn_type2>', byRef: true }],
        description: 'Reads values of datapoint attributes at a particular source time and writes them to variables.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetAsynch.html'
    }],
    ['dpGetComment', {
        name: 'dpGetComment',
        returnType: 'dyn_langString',
        parameters: [{ name: '[', type: 'string | dyn_string dp' }, { name: 'mode]', type: 'int' }],
        description: 'Returns the comment for the datapoint element(s).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetComment.html'
    }],
    ['dpGetDescription', {
        name: 'dpGetDescription',
        returnType: 'dyn_langString',
        parameters: [{ name: '[', type: 'string | dyn_string dp' }, { name: 'mode]', type: 'int' }],
        description: 'Returns the description for the datapoint element(s).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetDescription.html'
    }],
    ['dpGetDpTypeRefs', {
        name: 'dpGetDpTypeRefs',
        returnType: 'dyn_dyn_string',
        parameters: [{ name: 'dpt', type: 'string' }],
        description: 'The function returns all references in a DPT.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetDpTypeRefs.html'
    }],
    ['dpGetFormat', {
        name: 'dpGetFormat',
        returnType: 'langString',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'This function returns the "format" of a datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetFormat.html'
    }],
    ['dpGetId', {
        name: 'dpGetId',
        returnType: 'bool',
        parameters: [{ name: 'dpName', type: 'string' }, { name: 'dpId;', type: 'unsigned', byRef: true }],
        description: 'Returns the datapoint ID and the element ID of the defined datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetId.html'
    }],
    ['dpGetMaxAge', {
        name: 'dpGetMaxAge',
        returnType: 'int',
        parameters: [{ name: 'age', type: 'unsigned' }, { name: 'dp1', type: 'string' }, { name: 'var1', type: '<type1>', byRef: true }, { name: 'dp2', type: 'string' }, { name: 'var2', type: '<type2>', byRef: true }],
        description: 'If a peripheral address exists, the function triggers a singleQuery for a driver if the value of the datapoint element dpName is older than the parameter age and returns the value from the driver.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetMaxAge.html'
    }],
    ['dpGetName', {
        name: 'dpGetName',
        returnType: 'string',
        parameters: [{ name: 'dpId', type: 'uint' }, { name: 'elId[', type: 'int' }, { name: 'sysnum', type: 'int' }],
        description: 'Returns the datapoint name for the passed datapoint ID and element ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetName.html'
    }],
    ['dpGetPeriod', {
        name: 'dpGetPeriod',
        returnType: 'void',
        parameters: [],
        description: 'The function queries DP attributes over a specified period of time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetPeriod.html'
    }],
    ['dpGetPeriodSplit', {
        name: 'dpGetPeriodSplit',
        returnType: 'int',
        parameters: [{ name: 'reqId', type: 'int', byRef: true }, { name: 'progress', type: 'int', byRef: true }, { name: 't1', type: 'time' }, { name: 't2', type: 'time' }, { name: 'count', type: 'unsigned' }, { name: 'dp1', type: 'string' }, { name: 'xa1', type: '<dyn_type1>', byRef: true }, { name: 'ta1', type: 'dyn_time', byRef: true }, { name: 'dp2', type: 'string' }, { name: 'xa2', type: '<dyn_type2>', byRef: true }, { name: 'ta2', type: 'dyn_time', byRef: true }],
        description: 'Queries DP attributes over a certain period of time. Use the function when you query a large amount of data. The function reduces the system load and offers a considerable advantage when dealing with a large amount of data.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetPeriodSplit.html'
    }],
    ['dpGetRefsToDpType', {
        name: 'dpGetRefsToDpType',
        returnType: 'dyn_dyn_string',
        parameters: [{ name: 'reference', type: 'string' }],
        description: 'The function returns all DPTs and DPs that contain the specified DPT as a reference.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetRefsToDpType.html'
    }],
    ['dpGetStatusBit', {
        name: 'dpGetStatusBit',
        returnType: 'int',
        parameters: [{ name: 'aStatus', type: 'bit64' }, { name: 'aBitAttribute', type: 'string' }],
        description: 'Retrieves status bits.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetStatusBit.html'
    }],
    ['dpGetUnit', {
        name: 'dpGetUnit',
        returnType: 'langString',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'This function returns the unit of a datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpGetUnit.html'
    }],
    ['dpIsLegalName', {
        name: 'dpIsLegalName',
        returnType: 'bool',
        parameters: [{ name: 'dpName', type: 'string' }],
        description: 'Checks, whether the name of a datapoint contains incorrect characters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpIsLegalName.html'
    }],
    ['dpNameCheck', {
        name: 'dpNameCheck',
        returnType: 'bool',
        parameters: [{ name: 'dpName', type: 'string' }],
        description: 'This function should not be used anymore and was replaced by the function nameCheck(). Checks, whether the name of a datapoint contains only the following characters: 0...9, A...Z, _, a...z.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpNameCheck.html'
    }],
    ['dpNames', {
        name: 'dpNames',
        returnType: 'dyn_string',
        parameters: [{ name: 'dpPattern', type: 'string' }, { name: 'dpType', type: 'string' }, { name: 'ignoreCase', type: 'bool' }],
        description: 'Returns all the datapoint names or datapoint element names that match a pattern. The datapoint structures are written to the array in alphabetical order.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpNames.html'
    }],
    ['dpQuery', {
        name: 'dpQuery',
        returnType: 'int',
        parameters: [{ name: 'query', type: 'string' }, { name: 'tab', type: 'dyn_dyn_anytype', byRef: true }],
        description: 'Retrieves attribute values with the help of SQL statements.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpQuery.html'
    }],
    ['dpQueryConnectAll', {
        name: 'dpQueryConnectAll',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'wantsanswer', type: 'bool' }, { name: 'userData', type: 'anytype' }, { name: 'query', type: 'string' }, { name: 'blockingTime', type: 'int', optional: true }],
        description: 'The function dpQueryConnectAll subscribes to attributes of configs from multiple Data Point Elements, which meet a certain query condition. When a subscribed attribute changes, a callback function (“work” function) is executed. The event manager will always send all subscribed elements, even if only one changes. Therefore update messages will always contain all subscribed elements.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpQueryConnectAll.html'
    }],
    ['dpQueryConnectSingle', {
        name: 'dpQueryConnectSingle',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'wantsanswer', type: 'bool' }, { name: 'userData', type: 'anytype' }, { name: 'query', type: 'string' }, { name: 'blockingTime', type: 'int', optional: true }],
        description: 'The function dpQueryConnectSingle subscribes to attributes of configs from multiple Datapoint Elements, which meet a certain query condition. When a subscribed attribute changes, a callback function (“work” function) is executed. The Event Manager will send every single change separately, so update messages will normally contain only one element. If however several of the subscribed attributes are changed together within one message (i.e. in one dpSet() function call), then these will be all be forwarded in one message to the subscribing work function. Additionally, the execution of the work function can be delayed with the optional parameter blockingTime to accumulate more changes, increasing performance.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpQueryConnectSingle.html'
    }],
    ['dpQueryDisconnect', {
        name: 'dpQueryDisconnect',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'userData', type: 'anytype' }],
        description: 'Can be used to unregister work functions registered via dpQueryConnectAll() or dpQueryConnectSingle()',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpQueryDisconnect.html'
    }],
    ['dpQuerySplit', {
        name: 'dpQuerySplit',
        returnType: 'int',
        parameters: [{ name: 'reqId', type: 'int', byRef: true }, { name: 'progress', type: 'int', byRef: true }, { name: 'query', type: 'string' }, { name: 'tab', type: 'dyn_dyn_anytype', byRef: true }],
        description: 'Retrieves attribute values with the help of SQL statements. Use the function when you query a large amount of data. The function reduces the system load and offers a considerable advantage when dealing with a large amount of data.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpQuerySplit.html'
    }],
    ['dpRename', {
        name: 'dpRename',
        returnType: 'int',
        parameters: [{ name: 'oldName', type: 'string' }, { name: 'newName', type: 'string' }],
        description: 'The function renames a datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpRename.html'
    }],
    ['dpSelector', {
        name: 'dpSelector',
        returnType: 'int',
        parameters: [{ name: 's[', type: 'string', byRef: true }, { name: 'configs[', type: 'bool' }, { name: '[', type: 'string mode' }, { name: '[', type: 'bool showElements' }, { name: '[', type: 'string dptype' }, { name: 'toplevel', type: 'string' }, { name: 'group', type: '[string' }, { name: 'comment[', type: '[string' }, { name: 'alias', type: 'string' }, { name: 'showCNS', type: 'bool' }],
        description: 'Opens the datapoint selector and writes the selected datapoint address to s. See DP-Selector',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSelector.html'
    }],
    ['dpSet', {
        name: 'dpSet',
        returnType: 'int',
        parameters: [{ name: 'dp1', type: 'string' }, { name: '[', type: '<type1> var1' }, { name: 'dp2', type: 'string' }, { name: 'var2', type: '<type2>' }],
        description: 'The function assigns datapoint attributes values or creates datapoint configs.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSet.html'
    }],
    ['dpSetAlias', {
        name: 'dpSetAlias',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }, { name: 'alias', type: 'string' }],
        description: 'The function dpSetAlias() sets the alias for the specified datapoint element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSetAlias.html'
    }],
    ['dpSetComment', {
        name: 'dpSetComment',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }, { name: 'comment', type: 'langString' }],
        description: '',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSetComment.html'
    }],
    ['dpSetDescription', {
        name: 'dpSetDescription',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }, { name: 'comment', type: 'langString' }],
        description: 'Sets a comment for the datapoint element dp.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSetDescription.html'
    }],
    ['dpSetFormat', {
        name: 'dpSetFormat',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }, { name: 'dpFormat', type: 'langString' }],
        description: 'Sets the format of a DP element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSetFormat.html'
    }],
    ['dpSetTimed', {
        name: 'dpSetTimed',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }, { name: 'dp1', type: 'string' }, { name: 'val1[', type: '<type1>' }, { name: 'dp2', type: 'string' }, { name: 'val2', type: '<type2>' }],
        description: 'Assigns values and a source time to the original attributes that can be changed by the user or to the attribute "_corr.._value".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSetTimed.html'
    }],
    ['dpSetTimedWait', {
        name: 'dpSetTimedWait',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }, { name: 'dp1', type: 'string' }, { name: '[', type: '<type1> val1' }, { name: 'dp2', type: 'string' }, { name: 'val2', type: '<type2>' }],
        description: 'Assigns values and a source time to the original attributes that can be changed by the user or to the attribute "_corr.._value".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSetTimedWait.html'
    }],
    ['dpSetUnit', {
        name: 'dpSetUnit',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }, { name: 'dpUnit', type: 'langString' }],
        description: 'Sets the unit of a DP element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSetUnit.html'
    }],
    ['dpSetWait', {
        name: 'dpSetWait',
        returnType: 'int',
        parameters: [{ name: 'dp1', type: 'string' }, { name: '[', type: '<type1> var1' }, { name: 'dp2', type: 'string' }, { name: 'var2', type: '<type2>' }],
        description: 'Assigns datapoint attributes and waits for an answer from the event manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSetWait.html'
    }],
    ['dpSubStr', {
        name: 'dpSubStr',
        returnType: 'string',
        parameters: [{ name: 'dp', type: 'string' }, { name: 'pattern', type: 'int' }],
        description: 'The function dpSubStr() returns the part (sub string) of a datapoint name given by pattern. The function returns the neutral form of configs and attributes.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpSubStr.html'
    }],
    ['dpTreeSetIcons', {
        name: 'dpTreeSetIcons',
        returnType: 'int',
        parameters: [{ name: 'icons', type: 'mapping' }],
        description: 'Sets any icons for a system, a datapoint type or a datapoint element in the datapoint tree view.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpTreeSetIcons.html'
    }],
    ['dpTypeChange', {
        name: 'dpTypeChange',
        returnType: 'int',
        parameters: [{ name: 'names', type: 'dyn_dyn_string' }, { name: '[', type: 'dyn_dyn_int types' }, { name: 'elementNames]', type: 'dyn_string' }],
        description: 'The function changes datapoint types.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpTypeChange.html'
    }],
    ['dpTypeCreate', {
        name: 'dpTypeCreate',
        returnType: 'int',
        parameters: [{ name: 'elements', type: 'dyn_dyn_string' }, { name: 'types', type: 'dyn_dyn_int' }],
        description: 'The function creates a new datapoint type.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpTypeCreate.html'
    }],
    ['dpTypeDelete', {
        name: 'dpTypeDelete',
        returnType: 'int',
        parameters: [{ name: 'dpt', type: 'string' }],
        description: 'The function deletes an existing datapoint type.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpTypeDelete.html'
    }],
    ['dpTypeGet', {
        name: 'dpTypeGet',
        returnType: 'int',
        parameters: [{ name: 'name', type: 'string' }, { name: 'elements', type: 'dyn_dyn_string', byRef: true }, { name: 'types[', type: 'dyn_dyn_int', byRef: true }, { name: 'includeSubTypes', type: 'bool' }],
        description: 'Returns the structure of a datapoint type.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpTypeGet.html'
    }],
    ['dpTypeName', {
        name: 'dpTypeName',
        returnType: 'string',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'Returns the datapoint type for the datapoint name.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpTypeName.html'
    }],
    ['dpTypeRefName', {
        name: 'dpTypeRefName',
        returnType: 'string',
        parameters: [{ name: 'dpe', type: 'string' }],
        description: 'The function "dpTypeRefName" returns the type reference of the selected DPE.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpTypeRefName.html'
    }],
    ['dpTypes', {
        name: 'dpTypes',
        returnType: 'dyn_string',
        parameters: [{ name: 'pattern', type: 'string' }, { name: 'system', type: 'unsigned' }, { name: 'includeEmpty', type: 'bool' }],
        description: 'Returns all the datapoint types from the current project.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpTypes.html'
    }],
    ['dpValToString', {
        name: 'dpValToString',
        returnType: 'string',
        parameters: [{ name: 'dp', type: 'string' }, { name: 'val[', type: 'anytype' }, { name: 'unit', type: 'bool' }],
        description: 'This function converts the value specified in val into a string, with the format string of the datapoint element dp being used. If anytype is a dyn, then this function returns a dyn_string as the result.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpValToString.html'
    }],
    ['dpWaitForValue', {
        name: 'dpWaitForValue',
        returnType: 'int',
        parameters: [{ name: 'dpNamesWait', type: 'dyn_string' }, { name: 'conditions', type: 'dyn_anytype' }, { name: 'dpNamesReturn', type: 'dyn_string' }, { name: 'returnValues', type: 'dyn_anytype', byRef: true }, { name: '[', type: 'time timeout' }, { name: 'timerExpired]', type: 'bool', byRef: true }],
        description: 'The function waits for a certain time (timeout) for a value change that fulfills the condition and returns the values of the different or same datapoints via the parameter returnValues.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dpWaitForValue.html'
    }],
    ['dragStart', {
        name: 'dragStart',
        returnType: 'int',
        parameters: [{ name: 'information[', type: 'string' }, { name: 'pixmap', type: 'string' }],
        description: 'Starts a drag operation.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dragStart.html'
    }],
    ['dropAccept', {
        name: 'dropAccept',
        returnType: 'void',
        parameters: [],
        description: 'Defines whether a graphics object accepts drop operations.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dropAccept.html'
    }],
    ['duration', {
        name: 'duration',
        returnType: 'long',
        parameters: [],
        description: 'Returns the duration of the current media.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/duration.html'
    }],
    ['dynAppend', {
        name: 'dynAppend',
        returnType: 'int',
        parameters: [{ name: 'x', type: '<dyn_type>', byRef: true }, { name: 'y', type: '<type> y|<dyn_type>', byRef: true }],
        description: 'Appends y to the field x.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynAppend.html'
    }],
    ['dynAppendConst', {
        name: 'dynAppendConst',
        returnType: 'int',
        parameters: [{ name: 'x', type: '<dyn_type>', byRef: true }, { name: 'y', type: '<type>', byRef: true }],
        description: 'The functions is comparable to the function dynAppend() but will not change the source variable that is appended.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynAppendConst.html'
    }],
    ['dynAvg', {
        name: 'dynAvg',
        returnType: 'float',
        parameters: [{ name: '[', type: '<dyn_type> x' }, { name: 'mask]', type: 'dyn_bool' }],
        description: 'Returns the average of the elements of the dynamic field x.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynAvg.html'
    }],
    ['dynAvgWT', {
        name: 'dynAvgWT',
        returnType: 'float',
        parameters: [{ name: 'order', type: 'unsigned' }, { name: 't1', type: 'time' }, { name: 't2', type: 'time' }, { name: 'x', type: '<dyn_type>' }, { name: '[', type: 'dyn_time t' }, { name: 'mask]', type: 'dyn_bool' }],
        description: 'Returns the average of the elements of the dynamic field x.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynAvgWT.html'
    }],
    ['dynClear', {
        name: 'dynClear',
        returnType: 'int',
        parameters: [{ name: 'aDyn', type: '<dyn_type>', byRef: true }],
        description: 'Deletes the entire array.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynClear.html'
    }],
    ['dynContains', {
        name: 'dynContains',
        returnType: 'int',
        parameters: [{ name: 'x', type: '<dyn_type>' }, { name: 'y', type: '<type>' }],
        description: 'Returns the index of the first occurrence of y in the dynamic field x',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynContains.html'
    }],
    ['dynCount', {
        name: 'dynCount',
        returnType: 'int',
        parameters: [{ name: 'x', type: 'dyn_anytype' }, { name: 'y', type: 'anytype' }],
        description: 'Returns the number of elements with the same pattern in the array.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynCount.html'
    }],
    ['dynDynSort', {
        name: 'dynDynSort',
        returnType: 'int',
        parameters: [{ name: 'dynvar', type: 'dyn_dyn_type', byRef: true }, { name: 'col[', type: 'int | dyn_int' }, { name: 'ascending', type: 'bool | dyn_bool' }],
        description: 'Sorts a dynamic variable field of dyns in ascending or descending order according to a specific column.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynDynSort.html'
    }],
    ['dynDynTurn', {
        name: 'dynDynTurn',
        returnType: 'int',
        parameters: [{ name: 'dynvar', type: 'dyn_dyn_type', byRef: true }],
        description: 'The function dynDynTurn turns rows of a dyn_dyn_type variable into columns and visa versa.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynDynTurn.html'
    }],
    ['dynInsertAt', {
        name: 'dynInsertAt',
        returnType: 'int',
        parameters: [{ name: 'aDyn', type: '<dyn_type>', byRef: true }, { name: 'aValue', type: '<type>|<dyn_type>', optional: true, byRef: true }, { name: 'position', type: 'int' }],
        description: 'Inserts an element/elements in a field at the specified position.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynInsertAt.html'
    }],
    ['dynInsertAtConst', {
        name: 'dynInsertAtConst',
        returnType: 'int',
        parameters: [{ name: 'aDyn', type: '<dyn_type>', byRef: true }, { name: 'aValue', type: '< type >| <dyn_type >', optional: true, byRef: true }, { name: 'position', type: 'int' }],
        description: 'The function is comparable to dynInsertAt() but will not change the source variable that is inserted.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynInsertAtConst.html'
    }],
    ['dynIntersect', {
        name: 'dynIntersect',
        returnType: 'dyn_type',
        parameters: [{ name: 'key', type: 'dyn_type' }, { name: 'values', type: 'dyn_type' }],
        description: 'Returns a DynVar with each values from value, which occurs in key.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynIntersect.html'
    }],
    ['dynlen', {
        name: 'dynlen',
        returnType: 'int',
        parameters: [{ name: 'x', type: '<dyn_type>' }],
        description: 'Returns the number of elements of the dynamic field.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynlen.html'
    }],
    ['dynMax', {
        name: 'dynMax',
        returnType: 'int',
        parameters: [{ name: '[', type: 'dyn_int x' }, { name: 'mask]', type: 'dyn_bool' }],
        description: 'Outputs the largest field element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynMax.html'
    }],
    ['dynMin', {
        name: 'dynMin',
        returnType: 'int',
        parameters: [{ name: '[', type: 'dyn_int x' }, { name: 'mask]', type: 'dyn_bool' }],
        description: 'Outputs the smallest field element.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynMin.html'
    }],
    ['dynPatternMatch', {
        name: 'dynPatternMatch',
        returnType: 'dyn_string',
        parameters: [{ name: 'pattern', type: 'string' }, { name: 'ds', type: 'dyn_string' }],
        description: 'Checks whether particular strings in a dynamic field have a specific pattern.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynPatternMatch.html'
    }],
    ['dynRemove', {
        name: 'dynRemove',
        returnType: 'int',
        parameters: [{ name: 'aDyn', type: '<dyn_type>', byRef: true }, { name: 'element', type: 'int' }],
        description: 'Removes an element from a dyn variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynRemove.html'
    }],
    ['dynSort', {
        name: 'dynSort',
        returnType: 'int',
        parameters: [{ name: 'dynvar[', type: 'dyn_type' }, { name: 'ascending', type: 'bool' }],
        description: 'Sorts a dynamic variable field in ascending or descending order.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynSort.html'
    }],
    ['dynSortAsc', {
        name: 'dynSortAsc',
        returnType: 'int',
        parameters: [{ name: 'dynvar', type: '<dyn_type>', byRef: true }],
        description: 'Sorts a field in ascending order.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynSortAsc.html'
    }],
    ['dynSum', {
        name: 'dynSum',
        returnType: 'int',
        parameters: [{ name: '[', type: 'dyn_int x' }, { name: 'mask]', type: 'dyn_bool' }],
        description: 'Adds field elements.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynSum.html'
    }],
    ['dynUnique', {
        name: 'dynUnique',
        returnType: 'int',
        parameters: [{ name: 'x', type: '<dyn_type>', byRef: true }],
        description: 'Reduces field elements to unique elements and outputs their number.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlA_D/dynUnique.html'
    }],
    ['ecdhDeriveSharedSecret', {
        name: 'ecdhDeriveSharedSecret',
        returnType: 'int',
        parameters: [{ name: 'keyPairId', type: 'int' }, { name: 'peerPublicKey', type: 'blob', byRef: true }, { name: 'sharedSecret', type: 'blob', byRef: true }],
        description: 'Generates a shared secret based on the key pair for an ECDH key exchange.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ecdhDeriveSharedSecret.html'
    }],
    ['ecdhGenerateKeyPair', {
        name: 'ecdhGenerateKeyPair',
        returnType: 'int',
        parameters: [],
        description: 'The function generates a random private/public key pair for an ECDH key exchange.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ecdhGenerateKeyPair.html'
    }],
    ['ecdhGetPublicKey', {
        name: 'ecdhGetPublicKey',
        returnType: 'int',
        parameters: [{ name: 'keyPairId', type: 'int' }, { name: 'publicKey', type: 'blob', byRef: true }],
        description: 'The function stores the public key of the key pair for the ECDH key exchange.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ecdhGetPublicKey.html'
    }],
    ['ecdhReleaseKeyPair', {
        name: 'ecdhReleaseKeyPair',
        returnType: 'int',
        parameters: [{ name: 'keyPairId', type: 'int' }],
        description: 'The function releases a private/public key pair for an ECDH key exchange.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ecdhReleaseKeyPair.html'
    }],
    ['emRetrieveMail', {
        name: 'emRetrieveMail',
        returnType: 'int',
        parameters: [{ name: 'pop3_host', type: 'string' }, { name: 'user', type: 'string' }, { name: 'passwd', type: 'string' }, { name: 'emails', type: 'dyn_dyn_string', byRef: true }],
        description: 'The function connects to a POP3 server and checks wether there are mails. If there are, the function retrieves the mails and deletes the mail at the server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/emRetrieveMail.html'
    }],
    ['emSendMail', {
        name: 'emSendMail',
        returnType: 'void',
        parameters: [{ name: 'smtp_host', type: 'string' }, { name: 'name', type: 'string' }, { name: 'email', type: 'dyn_string' }, { name: 'ret', type: 'int', byRef: true }],
        description: 'This function allows sending mails.',
        deprecated: true,
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/emSendMail.html'
    }],
    ['enableMenuItem', {
        name: 'enableMenuItem',
        returnType: 'void',
        parameters: [{ name: 'moduleName', type: 'string' }, { name: 'menuItemName', type: 'string' }, { name: 'enable', type: 'bool' }],
        description: 'Supports disabling of menus (obsolete from version 3.5 up).',
        deprecated: true,
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/enableMenuItem.html'
    }],
    ['enableSound', {
        name: 'enableSound',
        returnType: 'bool',
        parameters: [{ name: 'type', type: 'int' }, { name: '[', type: 'bool enable' }, { name: 'fileName]', type: 'string' }],
        description: 'Switches the sound of a wave file during runtime (see Configuration file).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/enableSound.html'
    }],
    ['encrypt', {
        name: 'encrypt',
        returnType: 'int',
        parameters: [{ name: 'plaintext', type: 'string | blob' }, { name: 'passphrase', type: 'string' }, { name: '[', type: 'blob ciphertext' }, { name: 'cipherConfig]', type: 'string' }],
        description: 'Encrypts the given plaintext using the specified passphrase and configuration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/encrypt.html'
    }],
    ['enumKeys', {
        name: 'enumKeys',
        returnType: 'dyn_string',
        parameters: [{ name: 'enumName', type: 'string' }],
        description: 'The function returns the list of keys that are available within the enumeration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/enumKeys.html'
    }],
    ['enumValues', {
        name: 'enumValues',
        returnType: 'mapping',
        parameters: [{ name: 'enumName', type: 'string' }],
        description: 'The function returns the values of an enumeration as mapping.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/enumValues.html'
    }],
    ['errorDialog', {
        name: 'errorDialog',
        returnType: 'int',
        parameters: [{ name: 'error', type: 'dyn_errClass' }],
        description: 'Displays an error dialog.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/errorDialog.html'
    }],
    ['errorText', {
        name: 'errorText',
        returnType: 'string',
        parameters: [{ name: '[', type: 'unsigned code' }, { name: 'langIdx]', type: 'unsigned' }],
        description: 'Returns the text for the error code. This function should not be used anymore but remains included for reasons of compatibility. Instead of this function, use the functions getCatStr() or getErrorText(). These functions allow the definition of own error messages dependent on specific error codes. The error codes are saved in the file _errors.cat in the directory < wincc_oa_path >/msg/<lang>, respectively in the same file in the project directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/errorText.html'
    }],
    ['evalScript', {
        name: 'evalScript',
        returnType: 'int',
        parameters: [{ name: 'retVal', type: 'anytype', byRef: true }, { name: 'script', type: 'string' }, { name: '[', type: '[ dyn_string dollars' }, { name: '<arg>...]]', type: '<type>' }],
        description: 'Allows to execute a script during runtime and to write the return value of the script in retVal.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/evalScript.html'
    }],
    ['eventHost', {
        name: 'eventHost',
        returnType: 'dyn_string',
        parameters: [],
        description: 'Returns the host name the event manager is running on.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/eventHost.html'
    }],
    ['eventPort', {
        name: 'eventPort',
        returnType: 'unsigned',
        parameters: [],
        description: 'Returns the port number of the Event manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/eventPort.html'
    }],
    ['execJsFunction', {
        name: 'execJsFunction',
        returnType: 'void',
        parameters: [{ name: 'functionName', type: 'string' }, { name: 'message1[', type: 'anytype' }, { name: 'messageN]', type: 'anytype' }],
        description: 'The function allows to call a JavaScript function from within the WebView EWO JavaScript code directly from CTRL.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/execJsFunction.html'
    }],
    ['execScript', {
        name: 'execScript',
        returnType: 'int',
        parameters: [{ name: 'script', type: 'string' }, { name: '[', type: '[dyn_string dollars' }, { name: '<arg>...]]', type: '<type>' }],
        description: 'Allows to execute a script during runtime. Use this function for void main-functions (without return value).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/execScript.html'
    }],
    ['exit', {
        name: 'exit',
        returnType: 'int',
        parameters: [{ name: 'exitCode', type: 'int' }],
        description: 'Terminates a manager and passes the exit code to the operating system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/exit.html'
    }],
    ['exp', {
        name: 'exp',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Exponential function',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/exp.html'
    }],
    ['fabs', {
        name: 'fabs',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Returns the absolute value of x.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fabs.html'
    }],
    ['fclose', {
        name: 'fclose',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }],
        description: 'Closes a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fclose.html'
    }],
    ['feof', {
        name: 'feof',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }],
        description: 'Examines whether an end of file has been noted.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/feof.html'
    }],
    ['ferror', {
        name: 'ferror',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }],
        description: 'Examines whether a file error has been noted.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ferror.html'
    }],
    ['fflush', {
        name: 'fflush',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }],
        description: 'Writes data to a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fflush.html'
    }],
    ['fgets', {
        name: 'fgets',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string', byRef: true }, { name: 'count', type: 'int' }, { name: 'f', type: 'file' }],
        description: 'Returns a string from a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fgets.html'
    }],
    ['fileSelector', {
        name: 'fileSelector',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string', byRef: true }, { name: 'dir', type: 'mapping options | string' }, { name: 'notUp', type: 'bool' }, { name: 'pattern', type: 'string' }, { name: 'open', type: 'bool' }, { name: 'settingsId', type: 'string' }, { name: 'fileActions', type: 'bool' }],
        description: 'Opens a file selection dialog and returns the name of the selected file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fileSelector.html'
    }],
    ['fontAdjust', {
        name: 'fontAdjust',
        returnType: 'string',
        parameters: [{ name: 'font', type: 'string' }, { name: 'parameter', type: 'mapping' }],
        description: 'This function adjusts the font attributes (specified via the mapping parameter) for the given font (specified via the font string).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fontAdjust.html'
    }],
    ['fontToMapping', {
        name: 'fontToMapping',
        returnType: 'mapping',
        parameters: [{ name: 'font', type: 'string' }],
        description: 'The function returns a mapping for a specified font string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fontToMapping.html'
    }],
    ['findExecutable', {
        name: 'findExecutable',
        returnType: 'string',
        parameters: [{ name: 'name', type: 'string' }],
        description: 'The function searches for the given executable and returns the full path to it or an empty string if not found.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/findExecutable.html'
    }],
    ['fileToString', {
        name: 'fileToString',
        returnType: 'bool',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'result', type: 'string', byRef: true }, { name: 'encoding]', type: 'string' }],
        description: 'This function loads an ASCII file and writes the contents into a string variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fileToString.html'
    }],
    ['fillSelector', {
        name: 'fillSelector',
        returnType: 'int',
        parameters: [{ name: 'fillstr', type: 'string', byRef: true }],
        description: 'Opens the filling pattern selector and writes the selection to a variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fillSelector.html'
    }],
    ['floor', {
        name: 'floor',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Rounds down to an integer.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/floor.html'
    }],
    ['fmod', {
        name: 'fmod',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }, { name: 'y', type: 'float' }],
        description: '',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fmod.html'
    }],
    ['folderSelector', {
        name: 'folderSelector',
        returnType: 'int',
        parameters: [{ name: 'folder', type: 'string', byRef: true }, { name: 'fileActions', type: 'bool' }],
        description: 'Opens the folder selector dialog and writes the name of the selected folder to the string variable "path".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/folderSelector.html'
    }],
    ['fontSelector', {
        name: 'fontSelector',
        returnType: 'int',
        parameters: [{ name: 'fontstr', type: 'string | langString', byRef: true }],
        description: 'Opens the font type selector and writes the selection to a variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fontSelector.html'
    }],
    ['fopen', {
        name: 'fopen',
        returnType: 'file',
        parameters: [{ name: 'filename', type: 'string' }, { name: 'mode', type: 'string' }],
        description: 'Opens a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fopen.html'
    }],
    ['formatDebug', {
        name: 'formatDebug',
        returnType: 'string',
        parameters: [{ name: 'x', type: '<any>' }],
        description: 'Similar to the function Debug() but instead of writing to the log viewer returns the debug messages as string,.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/formatDebug.html'
    }],
    ['formatSelector', {
        name: 'formatSelector',
        returnType: 'int',
        parameters: [{ name: 'format', type: 'string', byRef: true }],
        description: 'Opens the format selector and writes the string format that has been selected on the format string variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/formatSelector.html'
    }],
    ['formatTime', {
        name: 'formatTime',
        returnType: 'string',
        parameters: [{ name: 'format', type: 'string' }, { name: '[', type: 'time t' }, { name: 'milliFormat]', type: 'string' }],
        description: 'Returns the time in a particular format.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/formatTime.html'
    }],
    ['fprintf', {
        name: 'fprintf',
        returnType: 'int',
        parameters: [{ name: 'file', type: 'file' }, { name: 'format', type: 'string' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Writes to a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fprintf.html'
    }],
    ['fprintfPL', {
        name: 'fprintfPL',
        returnType: 'int',
        parameters: [{ name: 'file', type: 'file' }, { name: 'format', type: 'string' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Writes to a file similar to fprintf() except changes to the current WinCC OA language before converting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fprintfPL.html'
    }],
    ['fprintfUL', {
        name: 'fprintfUL',
        returnType: 'int',
        parameters: [{ name: 'file', type: 'file' }, { name: 'format', type: 'string' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Writes to a file similar to fprintf() except changes to the current Windows user language before converting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fprintfUL.html'
    }],
    ['fputs', {
        name: 'fputs',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }, { name: 'f', type: 'file' }],
        description: 'Writes a string to a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fputs.html'
    }],
    ['fread', {
        name: 'fread',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }, { name: 'b[', type: 'blob', byRef: true }, { name: 'numBytes]', type: 'int' }],
        description: 'Reads a number of bytes from a file to a blob variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fread.html'
    }],
    ['fscanf', {
        name: 'fscanf',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }, { name: 'format', type: 'string' }, { name: 'var1', type: '<type1>', byRef: true }, { name: 'var2...]', type: '<type2>', byRef: true }],
        description: 'Reads a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fscanf.html'
    }],
    ['fscanfPL', {
        name: 'fscanfPL',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }, { name: 'format', type: 'string' }, { name: 'var1', type: '<type1>', byRef: true }, { name: 'var2...]', type: '<type2>', byRef: true }],
        description: 'Reads a file similar to fscanf() except changes to the current WinCC OA language before converting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fscanfPL.html'
    }],
    ['fscanfUL', {
        name: 'fscanfUL',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }, { name: 'format', type: 'string' }, { name: 'var1', type: '<type1>', byRef: true }, { name: 'var2...]', type: '<type2>', byRef: true }],
        description: 'Reads a file like fscanf(), but change to the current Windows user language before converting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fscanfUL.html'
    }],
    ['fseek', {
        name: 'fseek',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }, { name: 'offset', type: 'int' }, { name: 'whence', type: 'int' }],
        description: 'Sets the pointer of the file f from the position whence to the position defined by the offset.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fseek.html'
    }],
    ['fswAddPath', {
        name: 'fswAddPath',
        returnType: 'int',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The functions add a path for monitoring to the FileSystemWatcher.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fswAddPath.html'
    }],
    ['fswRemovePath', {
        name: 'fswRemovePath',
        returnType: 'int',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The function removes a path from the monitoring of the FileSystemWatcher.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fswRemovePath.html'
    }],
    ['ftell', {
        name: 'ftell',
        returnType: 'long',
        parameters: [{ name: 'f', type: 'file' }],
        description: 'The ftell function obtains the current value of the file position indicator for the stream pointed to by f.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ftell.html'
    }],
    ['fwrite', {
        name: 'fwrite',
        returnType: 'int',
        parameters: [{ name: 'f', type: 'file' }, { name: 'b[', type: 'blob' }, { name: 'numBytes]', type: 'int' }],
        description: 'Writes a number of bytes from a blob variable to a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/fwrite.html'
    }],
    ['getACount', {
        name: 'getACount',
        returnType: 'int',
        parameters: [{ name: 'AlertTime', type: 'atime' }],
        description: 'Returns the internal number of an alarm (count starts at 0) at a particular time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getACount.html'
    }],
    ['getActiveHttpServerUrl', {
        name: 'getActiveHttpServerUrl',
        returnType: 'string',
        parameters: [],
        description: 'Returns the URL of the server to which an HTTP request shall be sent.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getActiveHttpServerUrl.html'
    }],
    ['getActiveIconTheme', {
        name: 'getActiveIconTheme',
        returnType: 'string',
        parameters: [],
        description: 'Returns the icon theme currently in use.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getActiveIconTheme.html'
    }],
    ['getActiveLang', {
        name: 'getActiveLang',
        returnType: 'int',
        parameters: [],
        description: 'Returns the active language. The function getActiveLangId() provides the same functionality but returns an OaLanguage enum.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getActiveLang.html'
    }],
    ['getActiveLang', {
        name: 'getActiveLang',
        returnType: 'OaLanguage',
        parameters: [],
        description: 'Returns the active language as an OaLanguage Enum. This function is the same as getActiveLang() but uses the OaLanguage Enum as return value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getActiveLangId.html'
    }],
    ['getAIdentifier', {
        name: 'getAIdentifier',
        returnType: 'string',
        parameters: [{ name: 'AlertTime', type: 'atime' }],
        description: 'Outputs the name of a datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getAIdentifier.html'
    }],
    ['getAllDpAliases', {
        name: 'getAllDpAliases',
        returnType: 'int',
        parameters: [{ name: 'dps', type: 'dyn_string', byRef: true }, { name: 'aliases', type: 'dyn_string', byRef: true }],
        description: 'Returns all the datapoints and their aliases. Starting from version 2.11.1, the function has been renamed to dpGetAllAliases()',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getAllDpAliases.html'
    }],
    ['getAllGroupsPVSS', {
        name: 'getAllGroupsPVSS',
        returnType: 'dyn_mapping',
        parameters: [],
        description: 'Returns all WinCC OA user groups.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getAllGroupsPVSS.html'
    }],
    ['getAllLangIds', {
        name: 'getAllLangIds',
        returnType: 'vector<OaLanguage>',
        parameters: [],
        description: 'Returns a vector of all languages available in WinCC OA.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getAllLangIds.html'
    }],
    ['getAllUsersPVSS', {
        name: 'getAllUsersPVSS',
        returnType: 'dyn_mapping',
        parameters: [],
        description: 'Returns all WinCC OA users as well as the user data. The function is obsolete as of WinCC OA version 3.17. The function is, however, available for compatibility reasons. Use the function getAllSavedUsers() instead.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getAllUsersPVSS.html'
    }],
    ['getApplicationProperty', {
        name: 'getApplicationProperty',
        returnType: 'anytype',
        parameters: [{ name: 'property', type: 'string' }],
        description: 'Returns additional information about the client (browser) connected to the HTTP server or checks whether a stylesheet is used.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getApplicationProperty.html'
    }],
    ['getBit', {
        name: 'getBit',
        returnType: 'int',
        parameters: [{ name: 'aBitVar', type: 'bit32' }, { name: 'position', type: 'int' }],
        description: 'Returns the value of a particular bit.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getBit.html'
    }],
    ['getCatStr', {
        name: 'getCatStr',
        returnType: 'string',
        parameters: [{ name: 'catalog', type: 'string' }, { name: '[', type: 'string msgKey' }, { name: 'lang]', type: 'int' }],
        description: 'This function exports a catalog entry.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getCatStr.html'
    }],
    ['getClipboardText', {
        name: 'getClipboardText',
        returnType: 'string',
        parameters: [],
        description: 'Returns the clipboard text as plain text, or an empty string if the clipboard does not contain any text.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getClipboardText.html'
    }],
    ['getColorNames', {
        name: 'getColorNames',
        returnType: 'dyn_string',
        parameters: [{ name: 'colpattern', type: 'string', optional: true }],
        description: 'Outputs names of colors according to a pattern.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getColorNames.html'
    }],
    ['getComponentName', {
        name: 'getComponentName',
        returnType: 'string',
        parameters: [{ name: 'component', type: 'int' }],
        description: 'Returns the name of a component.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getComponentName.html'
    }],
    ['getConfigActiveHttpServerUrl', {
        name: 'getConfigActiveHttpServerUrl',
        returnType: 'string',
        parameters: [],
        description: 'Returns the URL which addresses the project\'s active HTTP Server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getConfigActiveHttpServerUrl.html'
    }],
    ['getConfirmDps', {
        name: 'getConfirmDps',
        returnType: 'int',
        parameters: [{ name: 'panelName', type: 'string' }, { name: 'list', type: 'dyn_string', byRef: true }, { name: 'dollars', type: '[dyn_string' }, { name: 'values]', type: 'dyn_string' }],
        description: 'Returns an array with the datapoints of a panel to be acknowledged.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getConfirmDps.html'
    }],
    ['getCurrentDomainName', {
        name: 'getCurrentDomainName',
        returnType: 'int',
        parameters: [{ name: 'domain', type: 'string', byRef: true }],
        description: '',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/UserAdmin/getCurrentDomainName.html'
    }],
    ['getCurrentOSUserLocal', {
        name: 'getCurrentOSUserLocal',
        returnType: 'int',
        parameters: [{ name: 'username', type: 'string', byRef: true }, { name: 'fullname', type: 'string', byRef: true }, { name: 'description', type: 'string', byRef: true }, { name: 'groups', type: 'dyn_string', byRef: true }, { name: 'password]', type: 'string' }],
        description: 'The function returns the user name, full name, description and the groups of a Windows & Linux user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/UserAdmin/getCurrentOSUserLocal.html'
    }],
    ['getCurrentTime', {
        name: 'getCurrentTime',
        returnType: 'time',
        parameters: [],
        description: 'Returns the current time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getCurrentTime.html'
    }],
    ['getCursorPosition', {
        name: 'getCursorPosition',
        returnType: 'int',
        parameters: [{ name: 'x', type: 'int', byRef: true }, { name: 'y', type: 'int', byRef: true }, { name: 'globalPos', type: 'bool', optional: true }],
        description: 'Returns the current position of the mouse cursor in a panel or screen.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getCursorPosition.html'
    }],
    ['getDollarList', {
        name: 'getDollarList',
        returnType: 'int',
        parameters: [{ name: 'panelFileName', type: 'string' }, { name: 'dollars', type: 'dyn_string', byRef: true }],
        description: 'The function getDollarList() returns the dollar parameters of a panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getDollarList.html'
    }],
    ['getDollarParams', {
        name: 'getDollarParams',
        returnType: 'int',
        parameters: [{ name: 'refName', type: 'string', byRef: true }, { name: 'dollars', type: 'dyn_string', byRef: true }, { name: 'values', type: 'dyn_string', byRef: true }],
        description: 'The dollar parameters of the reference can be queried using this CTRL function. Only in the panel for reference configuration in GEDI. Use getDollarParamsFromPanel() for getting the dollar parameters from a panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getDollarParams.html'
    }],
    ['getDollarParamsFromPanel', {
        name: 'getDollarParamsFromPanel',
        returnType: 'dyn_string',
        parameters: [{ name: 'panelName', type: 'string' }],
        description: 'The dollar parameters of the panel can be queried with this CTRL function.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getDollarParamsFromPanel.html'
    }],
    ['getDollarValue', {
        name: 'getDollarValue',
        returnType: 'string',
        parameters: [{ name: 'parameter', type: 'string' }],
        description: 'This function returns the value of a dollar parameter.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getDollarValue.html'
    }],
    ['getDomainOSUser', {
        name: 'getDomainOSUser',
        returnType: 'void',
        parameters: [],
        description: 'The function returns the domain, the user name, the full name, the description and the groups of the Windows user logged in.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/UserAdmin/getDomainOSUser.html'
    }],
    ['getDynAnytype', {
        name: 'getDynAnytype',
        returnType: 'dyn_anytype',
        parameters: [{ name: 'array', type: '<dyn_dyn_type>' }, { name: 'column', type: 'int' }],
        description: 'The functions return the content of a dyn-dyn variable column.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getDynAnytype.html'
    }],
    ['getenv', {
        name: 'getenv',
        returnType: 'string',
        parameters: [],
        description: 'Reads the value from an environment variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getenv.html'
    }],
    ['getErrorCatalog', {
        name: 'getErrorCatalog',
        returnType: 'string',
        parameters: [{ name: 'err', type: 'errClass err | dyn_errClass' }],
        description: 'Returns the error catalog (.cat) from the error class.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorCatalog.html'
    }],
    ['getErrorCode', {
        name: 'getErrorCode',
        returnType: 'int',
        parameters: [{ name: 'err', type: 'errClass err | dyn_errClass' }],
        description: 'Returns the error code from the error class from getLastError().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorCode.html'
    }],
    ['getErrorDpName', {
        name: 'getErrorDpName',
        returnType: 'string',
        parameters: [{ name: 'err', type: 'errClass err | dyn_errClass' }],
        description: 'Returns the datapoint name from getLastError().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorDpName.html'
    }],
    ['getErrorManId', {
        name: 'getErrorManId',
        returnType: 'int',
        parameters: [{ name: 'err', type: 'errClass err | dyn_errClass' }],
        description: 'Returns the manager identifier from getLastError() from the error class.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorManId.html'
    }],
    ['getErrorPriority', {
        name: 'getErrorPriority',
        returnType: 'int',
        parameters: [{ name: 'err', type: 'errClass err | dyn_errClass' }],
        description: 'Returns the priority of the error from getLastError() from the error class.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorPriority.html'
    }],
    ['getErrorStackTrace', {
        name: 'getErrorStackTrace',
        returnType: 'dyn_string',
        parameters: [{ name: 'exception', type: 'errClass | dyn_errClass' }],
        description: 'Returns a dynamic string containing the stack trace (call stack) of an occurred exception.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorStackTrace.html'
    }],
    ['getErrorText', {
        name: 'getErrorText',
        returnType: 'string',
        parameters: [{ name: 'err', type: 'errClass err | dyn_errClass' }],
        description: 'Returns the text part of an error message string from the error class (e.g. "no authorisation").',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorText.html'
    }],
    ['getErrorType', {
        name: 'getErrorType',
        returnType: 'int',
        parameters: [{ name: 'err', type: 'errClass err | dyn_errClass' }],
        description: 'Returns the type of error from getLastError() from the error class.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorType.html'
    }],
    ['getErrorUserId', {
        name: 'getErrorUserId',
        returnType: 'int',
        parameters: [{ name: 'err', type: 'errClass err | dyn_errClass' }],
        description: 'Returns the identification number of the user from the error class from getLastError().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getErrorUserId.html'
    }],
    ['getExt', {
        name: 'getExt',
        returnType: 'string',
        parameters: [],
        description: 'The function returns the file extension.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getExt.html'
    }],
    ['getFileCryptoHash', {
        name: 'getFileCryptoHash',
        returnType: 'string',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'algorithm', type: 'string' }],
        description: 'Allows to create a checksum for a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFileCryptoHash.html'
    }],
    ['getFileModificationTime', {
        name: 'getFileModificationTime',
        returnType: 'time',
        parameters: [{ name: 'PathFilename', type: 'string' }],
        description: 'The function returns the modification date and time of a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFileModificationTime.html'
    }],
    ['getFileNameFromPath', {
        name: 'getFileNameFromPath',
        returnType: 'string',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The function returns the file name and extension from the given path. This function does not check if the path/file exists.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFileNameFromPath.html'
    }],
    ['getFileNames', {
        name: 'getFileNames',
        returnType: 'dyn_string',
        parameters: [{ name: 'dir', type: '[string' }, { name: 'pattern', type: 'string' }, { name: 'filter', type: 'int' }],
        description: 'Lists the files or sub directories of a directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFileNames.html'
    }],
    ['getFileNamesLocal', {
        name: 'getFileNamesLocal',
        returnType: 'dyn_string',
        parameters: [{ name: 'dsDirectories', type: 'dyn_string' }, { name: 'pattern', type: 'string' }, { name: 'dsProjNames', type: 'dyn_string' }],
        description: 'The function searches for files recursive and relative to the project path.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFileNamesLocal.html'
    }],
    ['getFileNamesRemote', {
        name: 'getFileNamesRemote',
        returnType: 'dyn_string',
        parameters: [{ name: 'dsDirectories', type: 'dyn_string' }, { name: 'pattern', type: 'string' }, { name: 'dsProjNames', type: 'dyn_string' }],
        description: 'The function searches for files recursive and relative to the project path. The function works not only on a local machine but on mobile devices.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFileNamesRemote.html'
    }],
    ['getFileNamesRev', {
        name: 'getFileNamesRev',
        returnType: 'dyn_string',
        parameters: [{ name: 'dir', type: '[string' }, { name: 'pattern', type: 'string', optional: true }, { name: 'filter', type: 'int' }],
        description: 'Reverse of the function getFileNames().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFileNamesRev.html'
    }],
    ['getFilePermissions', {
        name: 'getFilePermissions',
        returnType: 'int',
        parameters: [{ name: 'filename', type: 'string' }],
        description: 'Retrieves the permissions for a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFilePermissions.html'
    }],
    ['getFilesFromDirectory', {
        name: 'getFilesFromDirectory',
        returnType: 'void',
        parameters: [{ name: 'files', type: 'dyn_string', byRef: true }, { name: 'absolutePath', type: 'const string' }, { name: 'relativePath', type: 'const string' }, { name: 'pattern', type: 'string' }],
        description: 'Adds all files names from given directory \'absolutePath\' to \'files\'.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFilesFromDirectory.html'
    }],
    ['getFileSize', {
        name: 'getFileSize',
        returnType: 'long',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The function checks the size of the defined file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFileSize.html'
    }],
    ['getFilesRecursive', {
        name: 'getFilesRecursive',
        returnType: 'void',
        parameters: [{ name: 'files', type: 'dyn_string', byRef: true }, { name: 'absolutePath', type: 'const string' }, { name: 'relativePath', type: 'const string' }, { name: 'pattern', type: 'string' }],
        description: 'Adds filenames to the parameter \'files\' from the given directory \'absolutePath\' including all subdirectories.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFilesRecursive.html'
    }],
    ['getFreeFolderSize', {
        name: 'getFreeFolderSize',
        returnType: 'ulong',
        parameters: [{ name: 'path', type: 'const string' }],
        description: 'The function returns the free bytes of the specified path (the remaining drive size is checked).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getFreeFolderSize.html'
    }],
    ['getGediNames', {
        name: 'getGediNames',
        returnType: 'dyn_string',
        parameters: [],
        description: 'Returns the opened modules of the type GEDI.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getGediNames.html'
    }],
    ['getGlobalLangId', {
        name: 'getGlobalLangId',
        returnType: 'int',
        parameters: [{ name: 'langIdx', type: 'int' }],
        description: 'Returns the sequence number of a project language from the lang.dir file < wincc_oa_path >/nls. This means that you pass an index of a project language (from the config file) as a parameter and the sequence number of this language from the lang.dir file will be returned.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getGlobalLangId.html'
    }],
    ['getGlobals', {
        name: 'getGlobals',
        returnType: 'int',
        parameters: [{ name: 'globaleVariableNames', type: 'dyn_string', byRef: true }, { name: 'globaleVariableTypes', type: 'dyn_int', byRef: true }],
        description: 'The function queries existing global variables.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getGlobals.html'
    }],
    ['getGlobalType', {
        name: 'getGlobalType',
        returnType: 'int',
        parameters: [{ name: 'globaleVariableName', type: 'string' }],
        description: 'The function queries the type of the specified global variables.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getGlobalType.html'
    }],
    ['getGroupDataPVSS', {
        name: 'getGroupDataPVSS',
        returnType: 'mapping',
        parameters: [{ name: 'pvssGroupID', type: 'unsigned' }],
        description: 'Returns group data for a WinCC OA group. The function is obsolete as of WinCC OA version 3.17. The function is, however, available for compatibility reasons! Use the function getGroup() instead.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getGroupDataPVSS.html'
    }],
    ['getGroupsOfUserPVSS', {
        name: 'getGroupsOfUserPVSS',
        returnType: 'dyn_mapping',
        parameters: [{ name: 'pvssUserID', type: 'unsigned' }],
        description: 'Returns the group memberships for a specific user. The function is obsolete as of WinCC OA version 3.17. The function is, however, available for compatibility reasons. Use the function UserManagement::getGroupsByUser(UserManagementUser user)',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getGroupsOfUserPVSS.html'
    }],
    ['getHostByAddr', {
        name: 'getHostByAddr',
        returnType: 'string',
        parameters: [{ name: 'name', type: 'string' }],
        description: 'Returns the host name for a given IP address.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getHostByAddr.html'
    }],
    ['getHostByName', {
        name: 'getHostByName',
        returnType: 'string',
        parameters: [{ name: '[', type: 'string name' }, { name: 'addr_list]', type: 'dyn_string', byRef: true }],
        description: 'Returns the IP address for a given host name.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getHostByName.html'
    }],
    ['getHostname', {
        name: 'getHostname',
        returnType: 'string',
        parameters: [],
        description: 'Returns the name of the current host as a string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getHostname.html'
    }],
    ['getInitialZoomFactor', {
        name: 'getInitialZoomFactor',
        returnType: 'float',
        parameters: [{ name: 'factor', type: 'float', byRef: true }],
        description: 'Returns the defined zoom factor that scales all panels (even childpanels) after the start of a UI.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getInitialZoomFactor.html'
    }],
    ['getKerberosSecurity', {
        name: 'getKerberosSecurity',
        returnType: 'int',
        parameters: [{ name: 'manId', type: 'int', optional: true }],
        description: 'Returns the Kerberos security level for the connection to a specified manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getKerberosSecurity.html'
    }],
    ['getLangIdx', {
        name: 'getLangIdx',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'string' }],
        description: 'The function getLangIdx() returns the sequence number of the passed language (language that has been passed as a parameter) from the project config file. If you, for example, pass the language ID "ru_RU.utf8" (Russian) as a parameter and this language is on the third place in the config file, the function returns 2. The function returns 2 instead of 3 because the index of the languages in the config file starts at 0.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getLangIdx.html'
    }],
    ['getLastError', {
        name: 'getLastError',
        returnType: 'dyn_errClass',
        parameters: [],
        description: 'Gets the last error that occurred.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getLastError.html'
    }],
    ['getLastException', {
        name: 'getLastException',
        returnType: 'dyn_errClass',
        parameters: [],
        description: 'Gets the last exception that occurred during processing of the function.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getLastException.html'
    }],
    ['getLicenseOption', {
        name: 'getLicenseOption',
        returnType: 'int',
        parameters: [{ name: 'option', type: 'string' }, { name: 'count', type: 'unsigned', optional: true }],
        description: 'The function getLicenseOption() allows you to query the current license and obtain a license from a license container.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getLicenseOption.html'
    }],
    ['getLocale', {
        name: 'getLocale',
        returnType: 'string',
        parameters: [{ name: 'langIdx', type: 'int' }, { name: 'format', type: 'int' }],
        description: 'Returns the language identifier',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getLocale.html'
    }],
    ['getManIdFromInt', {
        name: 'getManIdFromInt',
        returnType: 'int',
        parameters: [{ name: 'manIdInt', type: 'int' }, { name: 'manType', type: 'char', byRef: true }, { name: 'manNum', type: 'char', byRef: true }, { name: 'sysNum', type: 'int', byRef: true }, { name: 'replica]]', type: 'char', byRef: true }],
        description: 'Converts manager ID into manager type and manager number.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getManIdFromInt.html'
    }],
    ['getMetaLang', {
        name: 'getMetaLang',
        returnType: 'int',
        parameters: [],
        description: 'Returns the index of the meta language.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getMetaLang.html'
    }],
    ['getMultiValue', {
        name: 'getMultiValue',
        returnType: 'typeA_1_1>',
        parameters: [{ name: 'shapeA', type: 'string' }, { name: 'attributeA_1', type: 'string' }, { name: 'shapeB', type: '<typeA_1_1> parA_1_1 ... string', optional: true }, { name: 'attributeB_1', type: 'string' }, { name: '...', type: '<typeB_1_1> parB_1_1', optional: true }],
        description: 'Writes several graphics attributes to variables.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getMultiValue.html'
    }],
    ['getNetworkDevices', {
        name: 'getNetworkDevices',
        returnType: 'dyn_mapping',
        parameters: [],
        description: 'Returns a list of information for the available network devices and interfaces.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getNetworkDevices.html'
    }],
    ['getNoOfLangs', {
        name: 'getNoOfLangs',
        returnType: 'int',
        parameters: [],
        description: 'Gets the number of languages currently available.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getNoOfLangs.html'
    }],
    ['getOSDomainName', {
        name: 'getOSDomainName',
        returnType: 'void',
        parameters: [],
        description: 'The function returns the domain name under Windows and Linux, regardless which user is currently logged in.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/UserAdmin/getOSDomainName.html'
    }],
    ['getOSGroups', {
        name: 'getOSGroups',
        returnType: 'void',
        parameters: [],
        description: 'Returns an array containing the attributes of all groups of a domain (no local groups).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSGroups.html'
    }],
    ['getOSGroupID', {
        name: 'getOSGroupID',
        returnType: 'void',
        parameters: [],
        description: 'Returns the operating system ID of a specific user group.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSGroupID.html'
    }],
    ['getOSGroupInfo', {
        name: 'getOSGroupInfo',
        returnType: 'void',
        parameters: [],
        description: 'Returns the attributes of a domain group.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSGroupInfo.html'
    }],
    ['getOSGroupName', {
        name: 'getOSGroupName',
        returnType: 'string',
        parameters: [{ name: 'osid', type: 'string' }, { name: 'useCD', type: 'bool' }, { name: 'domain', type: 'string', optional: true }],
        description: 'Returns the group name for an OS specific ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSGroupName.html'
    }],
    ['getOSGroups', {
        name: 'getOSGroups',
        returnType: 'void',
        parameters: [],
        description: 'Returns an array containing the attributes of all groups of a domain (no local groups).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSGroups.html'
    }],
    ['getOSGroupUsers', {
        name: 'getOSGroupUsers',
        returnType: 'void',
        parameters: [],
        description: 'Returns all users of a group.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSGroupUsers.html'
    }],
    ['getOSUser', {
        name: 'getOSUser',
        returnType: 'void',
        parameters: [],
        description: 'The function returns the user name, the full name, the OS ID, the domain and the comment of the current user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/UserAdmin/getOSUser.html'
    }],
    ['getOSUserGroups', {
        name: 'getOSUserGroups',
        returnType: 'void',
        parameters: [],
        description: 'Returns an array containing the attributes of all groups a user is member of.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSUserGroups.html'
    }],
    ['getOSUserGroupsMembership', {
        name: 'getOSUserGroupsMembership',
        returnType: 'dyn_mapping',
        parameters: [{ name: 'userName', type: 'string' }, { name: 'filterGroupOSIDs', type: 'dyn_string' }, { name: 'domain', type: 'string', optional: true }],
        description: 'The function getOSUserGroupsMembership queries the operating system group memberships of a user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSUserGroupsMembership.html'
    }],
    ['getOSUserID', {
        name: 'getOSUserID',
        returnType: 'void',
        parameters: [],
        description: 'Returns the operating system ID of a specific user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSUserID.html'
    }],
    ['getOSUserInfo', {
        name: 'getOSUserInfo',
        returnType: 'void',
        parameters: [],
        description: 'Returns the attributes for a user "userName".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSUserInfo.html'
    }],
    ['getOSUserName', {
        name: 'getOSUserName',
        returnType: 'string',
        parameters: [{ name: 'osid', type: 'string' }, { name: 'useCD', type: 'bool' }, { name: 'domain', type: 'string', optional: true }],
        description: 'Returns the user name for an OS specific ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSUserName.html'
    }],
    ['getOSUsers', {
        name: 'getOSUsers',
        returnType: 'void',
        parameters: [],
        description: 'Returns an array (mapping) containing the user data (name, full name, OSID, Comment, PrimaryGroupOSID, PrimaryGroupName).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getOSUsers.html'
    }],
    ['getPanelPreview', {
        name: 'getPanelPreview',
        returnType: 'int',
        parameters: [{ name: 'image', type: 'anytype', byRef: true }, { name: 'panelFileName', type: 'string' }, { name: 'scaleFactor[[', type: 'float' }, { name: 'onlyShapeBounding', type: 'bool' }, { name: 'showInvisibleShapes', type: 'bool' }],
        description: 'Creates a preview (image) of the available panel references for Drag & Drop of DPTs and DPs.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getPanelPreview.html'
    }],
    ['getPanelSize', {
        name: 'getPanelSize',
        returnType: 'dyn_int',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'scaled', type: 'bool' }],
        description: 'Returns the size of a panel (width and height).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getPanelSize.html'
    }],
    ['getPath', {
        name: 'getPath',
        returnType: 'string',
        parameters: [{ name: 'keyword[', type: 'string' }, { name: 'filename[', type: 'string' }],
        description: 'This function determines the absolute paths for panels, scripts etc.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getPath.html'
    }],
    ['getPendingFileTransferCount', {
        name: 'getPendingFileTransferCount',
        returnType: 'int',
        parameters: [],
        description: 'The function getPendingFileTransferCount() returns the number of currently pending file transfers.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getPendingFileTransferCount.html'
    }],
    ['getPrimaryScreen', {
        name: 'getPrimaryScreen',
        returnType: 'int',
        parameters: [],
        description: 'Returns the number of the applications primary screen.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getPrimaryScreen.html'
    }],
    ['getPrinterNames', {
        name: 'getPrinterNames',
        returnType: 'dyn_string',
        parameters: [{ name: 'printerName', type: 'dyn_string', byRef: true }, { name: 'shareName', type: 'dyn_string', byRef: true }],
        description: 'The function returns a list of available printers.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getPrinterNames.html'
    }],
    ['getProjectLangIds', {
        name: 'getProjectLangIds',
        returnType: 'vector<OaLanguage>',
        parameters: [],
        description: 'Returns a vector of all languages available within the project.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getProjectLangIds.html'
    }],
    ['getRcvLevel', {
        name: 'getRcvLevel',
        returnType: 'int',
        parameters: [],
        description: 'The function returns the receive debug level for messages.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getRcvLevel.html'
    }],
    ['getReduDp', {
        name: 'getReduDp',
        returnType: 'bool',
        parameters: [{ name: 'dp', type: 'string' }, { name: 'sReturnDpReplica1', type: 'string', byRef: true }, { name: 'sReturnDpReplica2', type: 'string', byRef: true }],
        description: 'The function getReduDp() checks if a right-side redundancy partner exists (if the specified datapoint has a redundant partner).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getReduDp.html'
    }],
    ['getRemoteSystemHosts', {
        name: 'getRemoteSystemHosts',
        returnType: 'dyn_string',
        parameters: [{ name: 'sSystem', type: 'string' }],
        description: 'The function dyn_string getRemoteSystemHosts(string sSystem); returns the host names of the system sSystem. In case of redundancy, it returns the host name of both servers otherwise the host name of the first system only.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getRemoteSystemHosts.html'
    }],
    ['getRemoteSystemNamesConnected', {
        name: 'getRemoteSystemNamesConnected',
        returnType: 'int',
        parameters: [{ name: 'names', type: 'dyn_string', byRef: true }, { name: 'ids', type: 'dyn_uint', byRef: true }, { name: 'systemName', type: 'string' }],
        description: 'The function returns the host names and System IDs of the connected systems in a distributed system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getRemoteSystemNamesConnected.html'
    }],
    ['getScaleStyle', {
        name: 'getScaleStyle',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string', optional: true }],
        description: 'Returns the configured scale style of the module for zooming.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getScaleStyle.html'
    }],
    ['getScreenCount', {
        name: 'getScreenCount',
        returnType: 'int',
        parameters: [],
        description: 'Returns the number of the connected screens.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getScreenCount.html'
    }],
    ['getScreenNumber', {
        name: 'getScreenNumber',
        returnType: 'int',
        parameters: [{ name: 'x', type: 'int' }, { name: 'y', type: 'int' }],
        description: 'Returns the screen number for the stated coordinates.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getScreenNumber.html'
    }],
    ['getScreenshot', {
        name: 'getScreenshot',
        returnType: 'anytype',
        parameters: [{ name: 'screenNum', type: 'int' }],
        description: 'This function takes a screenshot, which can be saved with imageToFile().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getScreenshot.html'
    }],
    ['getScreenSize', {
        name: 'getScreenSize',
        returnType: 'int',
        parameters: [{ name: 'width', type: 'int', byRef: true }, { name: 'height', type: 'int', byRef: true }, { name: 'availableSize]', type: 'bool' }, { name: 'startX', type: 'int', byRef: true }, { name: 'startY', type: 'int', byRef: true }, { name: 'screenNum', type: 'int' }],
        description: 'Reads the current size of the given screens in pixel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getScreenSize.html'
    }],
    ['getScript', {
        name: 'getScript',
        returnType: 'string',
        parameters: [],
        description: 'Returns the script for setting parameters of a particular graphics attribute.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getScript.html'
    }],
    ['getSndLevel', {
        name: 'getSndLevel',
        returnType: 'int',
        parameters: [],
        description: 'The function returns the send debug level for messages.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getSndLevel.html'
    }],
    ['getShape', {
        name: 'getShape',
        returnType: 'shape',
        parameters: [{ name: 'shapeName', type: 'string' }],
        description: 'Graphics objects can be addressed with this CTRL function (instead of setValue()) and attributes can be set (see also Attributes of the graphics elements ). The examples of the graphics attributes are largely dealt with in accordance with this new method.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getShape.html'
    }],
    ['getShapeStrict', {
        name: 'getShapeStrict',
        returnType: 'shape',
        parameters: [{ name: 'objectName', type: 'string' }],
        description: 'This function is used to address graphics objects and set attributes. It is similar to getShape(), but uses a different search method.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getShapeStrict.html'
    }],
    ['getShapes', {
        name: 'getShapes',
        returnType: 'dyn_string',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'This function returns a list of shape names (or RefName.ShapeName) which are located in given Module/Panel parameters and fit the wanted attribute and value pair.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getShapes.html'
    }],
    ['getShapesStrict', {
        name: 'getShapesStrict',
        returnType: 'dyn_string',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'This function returns a list of shape names (or RefName.ShapeName) which are located in given Module/Panel parameters and fit the wanted attribute and value pair. It is similar to getShapes(), but uses a different search method.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getShapesStrict.html'
    }],
    ['getShapeStrict', {
        name: 'getShapeStrict',
        returnType: 'shape',
        parameters: [{ name: 'objectName', type: 'string' }],
        description: 'This function is used to address graphics objects and set attributes. It is similar to getShape(), but uses a different search method.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getShapeStrict.html'
    }],
    ['getStackTrace', {
        name: 'getStackTrace',
        returnType: 'dyn_string',
        parameters: [],
        description: 'Returns a dynamic string with the stack trace (call stack) from this position of the code.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getStackTrace.html'
    }],
    ['getStandardPath', {
        name: 'getStandardPath',
        returnType: 'string',
        parameters: [],
        description: 'The function getStandardPath() returns the directory path (location) where files of type (see parameter "type" below) should be written to, or an empty string if the location cannot be determined.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getStandardPath.html'
    }],
    ['getSystemEnvironment', {
        name: 'getSystemEnvironment',
        returnType: 'mapping',
        parameters: [],
        description: 'Returns a mapping of the environment variables.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getSystemEnvironment.html'
    }],
    ['getSystemId', {
        name: 'getSystemId',
        returnType: 'int',
        parameters: [{ name: 'systemName', type: 'string', optional: true }],
        description: 'Returns the system ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getSystemId.html'
    }],
    ['getSystemName', {
        name: 'getSystemName',
        returnType: 'string',
        parameters: [{ name: 'systemId', type: 'int', optional: true }],
        description: 'Returns the name of the system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getSystemName.html'
    }],
    ['getSystemNames', {
        name: 'getSystemNames',
        returnType: 'int',
        parameters: [{ name: 'names', type: 'dyn_string', byRef: true }, { name: 'ids', type: 'dyn_uint', byRef: true }],
        description: 'Returns a list of all the system names and system IDs known to the own system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getSystemNames.html'
    }],
    ['getThreadId', {
        name: 'getThreadId',
        returnType: 'int',
        parameters: [],
        description: 'Returns the identification number of the current thread.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getThreadId.html'
    }],
    ['getTranslationFile', {
        name: 'getTranslationFile',
        returnType: 'string',
        parameters: [{ name: 'level', type: 'int' }],
        description: 'Returns the translation file name of the project level.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getTranslationFile.html'
    }],
    ['getType', {
        name: 'getType',
        returnType: 'int',
        parameters: [],
        description: 'Query of the data type of any Control expression.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getType.html'
    }],
    ['getTypeName', {
        name: 'getTypeName',
        returnType: 'string',
        parameters: [],
        description: 'Returns the data type of any Control expression as string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getTypeName.html'
    }],
    ['getUserDataPVSS', {
        name: 'getUserDataPVSS',
        returnType: 'mapping',
        parameters: [{ name: 'pvssUserID', type: 'unsigned' }],
        description: 'Returns user data for a WinCC OA user. The function is obsolete as of WinCC OA version 3.17. Use the method getUser() of the UserManagement class instead.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getUserDataPVSS.html'
    }],
    ['getUiFunctionList', {
        name: 'getUiFunctionList',
        returnType: 'dyn_string',
        parameters: [{ name: 'mode', type: 'int', optional: true }],
        description: 'Returns all UI functions that can be used in WinCC OA scripts.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getUiFunctionList.html'
    }],
    ['getUiStyle', {
        name: 'getUiStyle',
        returnType: 'void',
        parameters: [],
        description: 'Returns the available display styles of windows and buttons dependent on the actually used style.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getUiStyle.html'
    }],
    ['getUserDataByNamePVSS', {
        name: 'getUserDataByNamePVSS',
        returnType: 'mapping',
        parameters: [{ name: 'userName', type: 'string' }],
        description: 'Returns user data for a WinCC OA user by name. The function is obsolete as of WinCC OA version 3.17. The function is, however, available for compatibility reasons. Use the function getUserByName() instead.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getUserDataByNamePVSS.html'
    }],
    ['getUserId', {
        name: 'getUserId',
        returnType: 'unsigned',
        parameters: [{ name: 'name', type: 'string', optional: true }],
        description: 'Returns the associated ID for the specified user name.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getUserId.html'
    }],
    ['getUserName', {
        name: 'getUserName',
        returnType: 'string',
        parameters: [{ name: 'id', type: 'unsigned', optional: true }],
        description: 'Returns the associated user name for a specified ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getUserName.html'
    }],
    ['getUserPermission', {
        name: 'getUserPermission',
        returnType: 'boolean',
        parameters: [{ name: '[', type: 'int level' }, { name: 'userid[', type: 'unsigned' }, { name: 'manType[', type: 'int' }, { name: 'manNum]]]', type: 'int' }],
        description: 'Checks authorizations.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getUserPermission.html'
    }],
    ['getUserPermissionForArea', {
        name: 'getUserPermissionForArea',
        returnType: 'void',
        parameters: [{ name: 'uPerm', type: 'bool', byRef: true }, { name: 'level', type: 'unsigned' }, { name: 'sAreaName', type: 'string' }, { name: 'sUser', type: '[string' }, { name: 'sManType', type: '[string' }, { name: 'sManNum]]', type: 'string', optional: true }],
        description: 'The function getUserPermissionForArea() gets the user permission for an area.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/UserAdmin/getUserPermissionForArea.html'
    }],
    ['getUsersInGroupPVSS', {
        name: 'getUsersInGroupPVSS',
        returnType: 'dyn_mapping',
        parameters: [{ name: 'pvssGroupID', type: 'unsigned' }],
        description: 'Returns the users for a specific group. The function is obsolete as of WinCC OA version 3.17. The function is, however, available for compatibility reasons. Use the function getSavedUsersByGroupId() instead.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getUsersInGroupPVSS.html'
    }],
    ['getValue', {
        name: 'getValue',
        returnType: 'int',
        parameters: [{ name: 'shape', type: 'string' }, { name: 'attribute1', type: 'string' }, { name: '[', type: '<type1_1> par1_1' }, { name: 'par1_2...', type: '<type1_2>', optional: true }, { name: 'attribute2', type: 'string' }, { name: '[', type: '<typ2_1> par2_1' }, { name: 'par2_2...]]', type: '<type2_2>' }],
        description: 'Reads graphics attribute values for a graphics object in variables.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getValue.html'
    }],
    ['getVariable', {
        name: 'getVariable',
        returnType: 'anytype',
        parameters: [{ name: 'which', type: 'string' }],
        description: 'The function returns the value of the specified variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getVariable.html'
    }],
    ['getVisionNames', {
        name: 'getVisionNames',
        returnType: 'dyn_string',
        parameters: [],
        description: 'Outputs all the open Vision modules.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getVisionNames.html'
    }],
    ['getWindowsEvents', {
        name: 'getWindowsEvents',
        returnType: 'void',
        parameters: [],
        description: 'The function returns the Windows events. The events under Windows are split into three different log types.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/UserAdmin/getWindowsEvents.html'
    }],
    ['getYoungerFiles', {
        name: 'getYoungerFiles',
        returnType: 'dyn_string',
        parameters: [{ name: 'startDir', type: 'string' }, { name: 'startTime', type: 'time' }],
        description: 'Returns all the files of a directory that has changed since a particular date.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getYoungerFiles.html'
    }],
    ['getZoomFactor', {
        name: 'getZoomFactor',
        returnType: 'float',
        parameters: [{ name: 'factor', type: 'float', byRef: true }, { name: 'moduleName', type: 'string', optional: true }],
        description: 'Reads the zoom factor for a panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getZoomFactor.html'
    }],
    ['getZoomRange', {
        name: 'getZoomRange',
        returnType: 'float',
        parameters: [{ name: 'minFactor', type: 'float', byRef: true }, { name: 'maxFactor', type: 'float', byRef: true }],
        description: 'Returns the minimum and maximum value that can be used while zooming.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/getZoomRange.html'
    }],
    ['globalExists', {
        name: 'globalExists',
        returnType: 'bool',
        parameters: [{ name: 'globaleVariableName', type: 'string' }],
        description: 'This function queries whether a specific global variable exists.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/globalExists.html'
    }],
    ['groupCreate', {
        name: 'groupCreate',
        returnType: 'void',
        parameters: [{ name: 'ls', type: 'langString' }, { name: 'bPrivate', type: 'bool' }, { name: 'newGroup', type: 'string', byRef: true }, { name: 'main', type: 'bool' }, { name: 'iError', type: 'int', byRef: true }],
        description: 'Creates a new datapoint group and passes the name of the created datapoint of the group as well as the error code via parameters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/groupCreate.html'
    }],
    ['groupDelete', {
        name: 'groupDelete',
        returnType: 'void',
        parameters: [{ name: 'group', type: 'string' }, { name: 'iError', type: 'int', byRef: true }],
        description: 'Deletes a datapoint group.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/groupDelete.html'
    }],
    ['gunzip', {
        name: 'gunzip',
        returnType: 'bool',
        parameters: [{ name: 'source', type: 'blob' }, { name: 'target', type: 'blob | string', byRef: true }],
        description: 'Extracts the content of source. The result is saved in the parameter target. CtrlZlib is a shared library with functions for data compression. It is based on libz (gzip, gunzip).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/gunzip.html'
    }],
    ['gzip', {
        name: 'gzip',
        returnType: 'bool',
        parameters: [{ name: 'source', type: 'blob | string' }, { name: 'target', type: 'blob', byRef: true }],
        description: 'CtrlZlib is a shared library with functions for data compression. It is based on libz (gzip, gunzip). The functiongzip()compresses the content of the parameter source. The result is saved in the parameter target.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/gzip.html'
    }],
    ['gzread', {
        name: 'gzread',
        returnType: 'int',
        parameters: [{ name: 'path', type: 'string' }, { name: 'content', type: 'string | blob', byRef: true }, { name: 'len[', type: 'int' }, { name: 'offset]', type: 'int' }],
        description: 'Reads maximum "len" bytes from the file "path" into the variable "content".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/gzread.html'
    }],
    ['gzwrite', {
        name: 'gzwrite',
        returnType: 'int',
        parameters: [{ name: 'path', type: 'string' }, { name: 'content', type: 'string|blob' }],
        description: 'CtrlZlib ia a shared library with functions for data compression. It is based on libz (gzip, gunzip).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/gzwrite.html'
    }],
    ['hasEvent', {
        name: 'hasEvent',
        returnType: 'bool',
        parameters: [{ name: 'object[', type: 'string|shape' }, { name: 'eventName', type: 'string' }],
        description: 'This function checks if an object defines an event.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/hasEvent.html'
    }],
    ['hasMethod', {
        name: 'hasMethod',
        returnType: 'bool',
        parameters: [{ name: 'object[', type: 'string|shape' }, { name: 'methodName', type: 'string' }],
        description: 'The function returns TRUE when the specified method exists.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/hasMethod.html'
    }],
    ['HOOK_aes_acknowledgeTableFunction', {
        name: 'HOOK_aes_acknowledgeTableFunction',
        returnType: 'bool',
        parameters: [{ name: 'sObjectName', type: 'string' }, { name: 'iType', type: 'int' }, { name: 'mTableMultipleRows', type: 'mapping' }],
        description: 'The system executes the function when you acknowledge an alert in the alert screen. Implement the function in a CONTROL library.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/HOOK_aes_acknowledgeTableFunction.html'
    }],
    ['HOOK_ep_acknowledgeTableFunction', {
        name: 'HOOK_ep_acknowledgeTableFunction',
        returnType: 'void',
        parameters: [],
        description: 'The system executes the function when you acknowledge a table (when you use the simple configuration ). Implement the function in a CONTROL library.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/HOOK_ep_acknowledgeTableFunction.html'
    }],
    ['HOOK_isAckable', {
        name: 'HOOK_isAckable',
        returnType: 'void',
        parameters: [],
        description: 'The system executes the function when you acknowledge alarms. Implement the function in a CONTROL library.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/HOOK_isAckable.html'
    }],
    ['hour', {
        name: 'hour',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the hour portion (0 to 23) of a time t.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/hour.html'
    }],
    ['html_ref', {
        name: 'html_ref',
        returnType: 'void',
        parameters: [{ name: 'html', type: 'string', byRef: true }, { name: 'sFilename', type: 'string' }, { name: 'asDollar', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }],
        description: 'This function loads a reference into an HTML reference. The parameters will be replaced.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/html_ref.html'
    }],
    ['httpAccessLog', {
        name: 'httpAccessLog',
        returnType: 'void',
        parameters: [],
        description: 'Creates an httpAccess.log file in the log directory and writes a log line for each HTTP request into the file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpAccessLog.html'
    }],
    ['httpCloseWebSocket', {
        name: 'httpCloseWebSocket',
        returnType: 'void',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function closes web sockets.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpCloseWebSocket.html'
    }],
    ['httpConnect', {
        name: 'httpConnect',
        returnType: 'void',
        parameters: [],
        description: 'Registers a CTRL function as a Web resource',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpConnect.html'
    }],
    ['httpDisconnect', {
        name: 'httpDisconnect',
        returnType: 'void',
        parameters: [],
        description: 'Remove a registered Web-Resource',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpDisconnect.html'
    }],
    ['httpGetContent', {
        name: 'httpGetContent',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }, { name: 'content', type: '<string|blob>' }],
        description: 'This function extracts the content of the currently processing HTTP-Request.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpGetContent.html'
    }],
    ['httpGetHeader', {
        name: 'httpGetHeader',
        returnType: 'void',
        parameters: [],
        description: 'Returns the value of the header (== key) of the last HTTP message.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpGetHeader.html'
    }],
    ['httpGetLanguage', {
        name: 'httpGetLanguage',
        returnType: 'void',
        parameters: [],
        description: 'The function checks the stated client connection and returns a matching language ID. The function httpGetLanguageId() can be used to keep the same functionality but have a OaLanguage enum value returned.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpGetLanguage.html'
    }],
    ['httpGetLanguage', {
        name: 'httpGetLanguage',
        returnType: 'OaLanguage',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function checks the stated client connection and returns a matching OaLanguage enum value. This function provides the same functionality as httpGetLanguage(), but uses the new OaLanguage enum as return value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpGetLanguageId.html'
    }],
    ['httpGetURI', {
        name: 'httpGetURI',
        returnType: 'string',
        parameters: [],
        description: 'Returns the last from the Client (index) requested URI from the HTTP server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpGetURI.html'
    }],
    ['httpMakeParamString', {
        name: 'httpMakeParamString',
        returnType: 'void',
        parameters: [],
        description: 'Returns a string from the passed arguments that represents the query part of a URL.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpMakeParamString.html'
    }],
    ['httpOnConnectionClose', {
        name: 'httpOnConnectionClose',
        returnType: 'int',
        parameters: [{ name: 'callBackFunc', type: 'string | function_ptr' }],
        description: 'The function starts the specified callBack function when the HTTP connection is closed.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpOnConnectionClose.html'
    }],
    ['httpParseDate', {
        name: 'httpParseDate',
        returnType: 'void',
        parameters: [],
        description: 'Allows parsing an RFC-2616 conform date string, e.g. from header "If-Modified-Since".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpParseDate.html'
    }],
    ['httpReadWebSocket', {
        name: 'httpReadWebSocket',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }, { name: 'message', type: '<string|blob|anytype>', byRef: true }],
        description: 'The function reads web sockets.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpReadWebSocket.html'
    }],
    ['httpSaveFilesFromUpload', {
        name: 'httpSaveFilesFromUpload',
        returnType: 'void',
        parameters: [],
        description: 'The function returns the HTTP content of a Blob variable that was received from an HTTP client via an HTML form. The function copies the content of this blob variable (a file) into a directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpSaveFilesFromUpload.html'
    }],
    ['httpServer', {
        name: 'httpServer',
        returnType: 'void',
        parameters: [],
        description: 'Installs and activates an HTTP server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpServer.html'
    }],
    ['httpSetMaxAge', {
        name: 'httpSetMaxAge',
        returnType: 'void',
        parameters: [],
        description: 'Defines the time in seconds how long files should be cached by the client.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpSetMaxAge.html'
    }],
    ['httpSetMaxContentLength', {
        name: 'httpSetMaxContentLength',
        returnType: 'void',
        parameters: [],
        description: 'Sets the maximum length of a POST request.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpSetMaxContentLength.html'
    }],
    ['httpSetMethodHandler', {
        name: 'httpSetMethodHandler',
        returnType: 'int',
        parameters: [{ name: 'method', type: 'string' }],
        description: 'The function can be used to redirect an HTTP method to a user-defined CTRL callback function.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpSetMethodHandler.html'
    }],
    ['httpSetPermission', {
        name: 'httpSetPermission',
        returnType: 'void',
        parameters: [],
        description: 'The function httpSetPemission() allows to define more fine grained user permissions for a specific URL used with the HTTP Server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpSetPermission.html'
    }],
    ['httpSetSecondaryAuthSuccess', {
        name: 'httpSetSecondaryAuthSuccess',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }, { name: 'success', type: '<string|bool' }],
        description: 'The function is used to check for secondary authentification and implement a login delay.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpSetSecondaryAuthSuccess.html'
    }],
    ['httpWriteWebSocket', {
        name: 'httpWriteWebSocket',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function writes web sockets.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/httpWriteWebSocket.html'
    }],
    ['iec61850_createRcbDp', {
        name: 'iec61850_createRcbDp',
        returnType: 'bool',
        parameters: [{ name: 'sIed', type: 'string' }, { name: 'sRcb', type: 'string' }, { name: 'bIdx', type: 'bool' }],
        description: 'This function allows to create internal RCB datapoints.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/iec61850_createRcbDp.html'
    }],
    ['iec61850_deleteRcbDp', {
        name: 'iec61850_deleteRcbDp',
        returnType: 'bool',
        parameters: [{ name: 'sIed', type: 'string' }, { name: 'sRcb', type: 'string' }],
        description: 'Deletes the given internal RCB datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/iec61850_deleteRcbDp.html'
    }],
    ['imageToFile', {
        name: 'imageToFile',
        returnType: 'int',
        parameters: [{ name: 'image', type: 'const anytype', byRef: true }, { name: 'fileName', type: 'string' }],
        description: 'Stores an images which was created using getPanelPreview() (or using QVarPicture) to a file on the disk.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/imageToFile.html'
    }],
    ['inputRecorderIsRecording', {
        name: 'inputRecorderIsRecording',
        returnType: 'string',
        parameters: [],
        description: 'The function returns the script after the recording is stopped.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/inputRecorderGetScript.html'
    }],
    ['inputRecorderIsRecording', {
        name: 'inputRecorderIsRecording',
        returnType: 'bool',
        parameters: [],
        description: 'The function shows if the input recorder is currently recording.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/inputRecorderIsRecording.html'
    }],
    ['inputRecorderStart', {
        name: 'inputRecorderStart',
        returnType: 'int',
        parameters: [],
        description: 'The function starts the input recording.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/inputRecorderStart.html'
    }],
    ['inputRecorderStop', {
        name: 'inputRecorderStop',
        returnType: 'int',
        parameters: [],
        description: 'The function stops the input recording.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/inputRecorderStop.html'
    }],
    ['invokeMethod', {
        name: 'invokeMethod',
        returnType: 'anytype',
        parameters: [{ name: 'object', type: 'string|shape' }, { name: 'methodName', type: 'string' }],
        description: 'Invokes a method of a EWO widget or of a reference created via CTRL++ / OOP.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/invokeMethod.html'
    }],
    ['isAckable', {
        name: 'isAckable',
        returnType: 'void',
        parameters: [{ name: 'iType', type: 'int' }, { name: 'dsDPs', type: 'dyn_string', byRef: true }, { name: 'iReturnValue[', type: 'int', byRef: true }, { name: 'dTimeOfAlarm', type: 'dyn_time' }],
        description: 'The CTRLLib.ctl function is called before an acknowledgment with a simple configuration (see Acknowledge ).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isAckable.html'
    }],
    ['isAlertAttribute', {
        name: 'isAlertAttribute',
        returnType: 'bool',
        parameters: [{ name: 'attr', type: 'string' }],
        description: 'Indicates whether the passed attribute is an alarm attribute. That means whether is can be queried with alertGetPeriod(), alertConnect(), SELECT ALERT or can be set with alertSet().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isAlertAttribute.html'
    }],
    ['isAnswer', {
        name: 'isAnswer',
        returnType: 'bool',
        parameters: [],
        description: 'The function isAnswer() checks whether the workFunction() of a dpConnect() is called the first time after the connection was established via dpConnect().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isAnswer.html'
    }],
    ['isAudioAvailable', {
        name: 'isAudioAvailable',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks if audio is available for the playback.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isAudioAvailable.html'
    }],
    ['isConnActive', {
        name: 'isConnActive',
        returnType: 'bool',
        parameters: [{ name: 'manId', type: 'int' }],
        description: 'The function checks whether the connection to the event manager is active. The function is used in split mode to determine the active EM connection. The host the user interface is logical connected to is shown in the system overview. See chapter System overview with redundancy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isConnActive.html'
    }],
    ['isConnOpen', {
        name: 'isConnOpen',
        returnType: 'bool',
        parameters: [{ name: 'manId', type: 'int' }],
        description: 'The function checks if the connection from the own user interface manager to the event manager exists. The function is used in a redundant system. With this function, you can find out to which event manager the UI is connected to (to the left or to the right).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isConnOpen.html'
    }],
    ['isDbgFlag', {
        name: 'isDbgFlag',
        returnType: 'bool',
        parameters: [{ name: 'flag', type: 'string name | int' }],
        description: 'Queries if a flag with the defined name or number has been set.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isDbgFlag.html'
    }],
    ['isDialog', {
        name: 'isDialog',
        returnType: 'bool',
        parameters: [],
        description: 'Checks if a panel was opened with openDialog().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isDialog.html'
    }],
    ['isdir', {
        name: 'isdir',
        returnType: 'bool',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The function checks if a specified directory exists.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isdir.html'
    }],
    ['isDirectory', {
        name: 'isDirectory',
        returnType: 'int',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The function checks if the specified string is a directory or a file. The function returns 1 if the specified string is a directory and 0 if the specified string is a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isDirectory.html'
    }],
    ['isDistributed', {
        name: 'isDistributed',
        returnType: 'bool',
        parameters: [],
        description: 'The function returns TRUE if the entry distributed = 1 exists for the manager in the config file. If the entry distributed in the config file is not 1, FALSE will be returned. In case of a remote UI, the distributed entry is set by the Data Manager when distributed = 0/1 does not exist in the file. In this way, also other systems than the own local system can be accessed.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isDistributed.html'
    }],
    ['isDollarDefined', {
        name: 'isDollarDefined',
        returnType: 'bool',
        parameters: [{ name: 'parameter', type: 'string' }],
        description: 'This function queries whether a specific dollar parameter exists.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isDollarDefined.html'
    }],
    ['isDpTypeStruct', {
        name: 'isDpTypeStruct',
        returnType: 'void',
        parameters: [],
        description: 'Checks if a datapoint type is a struct type.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isDpTypeStruct.html'
    }],
    ['isDpTypeSumAlert', {
        name: 'isDpTypeSumAlert',
        returnType: 'void',
        parameters: [],
        description: 'Checks if a sum alert or a normal alert can be configured for a datapoint type.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isDpTypeSumAlert.html'
    }],
    ['isEvConnOpen', {
        name: 'isEvConnOpen',
        returnType: 'bool',
        parameters: [],
        description: 'Returns the status of the connection to the Event Manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isEvConnOpen.html'
    }],
    ['isfile', {
        name: 'isfile',
        returnType: 'bool',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'The function tests if a specified file exists.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isfile.html'
    }],
    ['isFunctionDefined', {
        name: 'isFunctionDefined',
        returnType: 'bool',
        parameters: [{ name: 'funcName', type: 'string' }],
        description: 'Returns whether a specific function exists or not.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isFunctionDefined.html'
    }],
    ['isInBrowser', {
        name: 'isInBrowser',
        returnType: 'bool',
        parameters: [],
        description: 'Verifies whether the UI Manager is running in the Web Client plugin inside the web browser.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isInBrowser.html'
    }],
    ['isinf', {
        name: 'isinf',
        returnType: 'bool',
        parameters: [{ name: 'x', type: 'double' }],
        description: 'Indicates whether the returned value of a mathematical function is an infinite value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isinf.html'
    }],
    ['isMobileDevice', {
        name: 'isMobileDevice',
        returnType: 'void',
        parameters: [],
        description: 'This function queries if the device from which the function is called is a mobile device or not.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isMobileDevice.html'
    }],
    ['isModeExtended', {
        name: 'isModeExtended',
        returnType: 'bool',
        parameters: [],
        description: 'This function returns whether the Vision has been opened in extended mode (configuration mode) or not.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isModeExtended.html'
    }],
    ['isModuleOpen', {
        name: 'isModuleOpen',
        returnType: 'bool',
        parameters: [{ name: 'modulename', type: 'string' }],
        description: 'Specifies whether a particular module is open.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isModuleOpen.html'
    }],
    ['isMotif', {
        name: 'isMotif',
        returnType: 'bool',
        parameters: [],
        description: 'Specifies whether the user interface is UI Motif (obsolete as of version 3.5. The return value is always FALSE ).',
        deprecated: true,
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isMotif.html'
    }],
    ['isnan', {
        name: 'isnan',
        returnType: 'bool',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Indicates whether the returned value of a mathematical function is a NaN (Not a Number).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isnan.html'
    }],
    ['isPanelInGedi', {
        name: 'isPanelInGedi',
        returnType: 'bool',
        parameters: [],
        description: 'The function returns TRUE when the panel where the function is used is open in GEDI.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isPanelInGedi.html'
    }],
    ['isPanelOpen', {
        name: 'isPanelOpen',
        returnType: 'bool',
        parameters: [{ name: '[', type: 'string panelname' }, { name: 'moduleName]', type: 'string' }],
        description: 'The function returns whether a particular panel is open.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isPanelOpen.html'
    }],
    ['isPaused', {
        name: 'isPaused',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks if the playback is paused.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isPaused.html'
    }],
    ['isPlaying', {
        name: 'isPlaying',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks whether the playback is playing.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isPlaying.html'
    }],
    ['isProgressBarOpen', {
        name: 'isProgressBarOpen',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks, whether a progress bar is open.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isProgressBarOpen.html'
    }],
    ['isReduActive', {
        name: 'isReduActive',
        returnType: 'bool',
        parameters: [],
        description: 'Returns TRUE if the event manager to which a CTRL or UI manager is connected is currently active.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isReduActive.html'
    }],
    ['isReduDp', {
        name: 'isReduDp',
        returnType: 'bool',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'The function isReduDp() checks if the specified datapoint is redundant.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isReduDP.html'
    }],
    ['isRedundant', {
        name: 'isRedundant',
        returnType: 'bool',
        parameters: [],
        description: 'This function returns whether the project has been configured as redundant.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isRedundant.html'
    }],
    ['isRefresh', {
        name: 'isRefresh',
        returnType: 'bool',
        parameters: [],
        description: 'With the function isRefresh(), you can check whether the workFunction of a dpConnect() has been triggered by a redundancy switch or has been triggered when trying to establish a connection to a distributed system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isRefresh.html'
    }],
    ['isRemoteSystemRedundant', {
        name: 'isRemoteSystemRedundant',
        returnType: 'void',
        parameters: [{ name: 'iAnswer', type: 'int', byRef: true }, { name: 'System', type: 'string' }],
        description: 'This function returns whether the project has been configured as redundant.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isRemoteSystemRedundant.html'
    }],
    ['isSeekable', {
        name: 'isSeekable',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks whether a playback can be searched for.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isSeekable.html'
    }],
    ['isSplitModeActive', {
        name: 'isSplitModeActive',
        returnType: 'void',
        parameters: [],
        description: 'Returns whether split mode has been activated in the system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isSplitModeActive.html'
    }],
    ['isStopped', {
        name: 'isStopped',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks if the playback is stopped.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isStopped.html'
    }],
    ['isVideoAvailable', {
        name: 'isVideoAvailable',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks if video is available for the playback.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/isVideoAvailable.html'
    }],
    ['jsonDecode', {
        name: 'jsonDecode',
        returnType: 'any type>',
        parameters: [{ name: 'json', type: 'string' }],
        description: 'The function jsonDecode() decodes a JSON encoded string variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/jsonDecode.html'
    }],
    ['jsonEncode', {
        name: 'jsonEncode',
        returnType: 'string',
        parameters: [{ name: '[', type: 'anytype any' }, { name: 'compactFormat', type: 'bool' }],
        description: 'The function encodes data into an JSON format string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/jsonEncode.html'
    }],
    ['jwtDecode', {
        name: 'jwtDecode',
        returnType: 'string',
        parameters: [{ name: 'jwt', type: 'string' }, { name: '[', type: 'string key' }, { name: 'algorithm', type: 'string', optional: true }, { name: 'ignoreSignature', type: 'bool' }],
        description: 'The function decodes a JSON Web Token (JWT).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/jwtDecode.html'
    }],
    ['jwtEncode', {
        name: 'jwtEncode',
        returnType: 'string',
        parameters: [{ name: 'payload', type: 'string' }, { name: '[', type: 'string key' }, { name: ']', type: 'string algorithm' }],
        description: 'Returns an encoded JSON Web Token (JWT).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/jwtEncode.html'
    }],
    ['langEditor', {
        name: 'langEditor',
        returnType: 'int',
        parameters: [{ name: 'ls[', type: 'langString', byRef: true }],
        description: 'Opens a language editor (langEditor)',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/langEditor.html'
    }],
    ['LayerOff', {
        name: 'LayerOff',
        returnType: 'void',
        parameters: [],
        description: 'Hides a layer.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/LayerOff.html'
    }],
    ['LayerOffPanel', {
        name: 'LayerOffPanel',
        returnType: 'void',
        parameters: [],
        description: 'Hides a layer in a particular panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/LayerOffPanel.html'
    }],
    ['LayerOffPanelInModule', {
        name: 'LayerOffPanelInModule',
        returnType: 'void',
        parameters: [],
        description: 'Hides a layer in a particular panel and module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/LayerOffPanelInModule.html'
    }],
    ['LayerOn', {
        name: 'LayerOn',
        returnType: 'void',
        parameters: [],
        description: 'Displays a layer.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/LayerOn.html'
    }],
    ['LayerOnPanel', {
        name: 'LayerOnPanel',
        returnType: 'void',
        parameters: [],
        description: 'Displays a layer in a particular panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/LayerOnPanel.html'
    }],
    ['LayerOnPanelInModule', {
        name: 'LayerOnPanelInModule',
        returnType: 'void',
        parameters: [],
        description: 'Display a layer in a particular panel and particular module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/LayerOnPanelInModule.html'
    }],
    ['ldexp', {
        name: 'ldexp',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }, { name: 'n', type: 'int' }],
        description: 'Calculates x*2^n.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ldexp.html'
    }],
    ['lineSelector', {
        name: 'lineSelector',
        returnType: 'int',
        parameters: [{ name: 'linestr', type: 'string', byRef: true }],
        description: 'Opens the line type selector and writes a line type selected there to a variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/lineSelector.html'
    }],
    ['log', {
        name: 'log',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Calculates the natural logarithm',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/log.html'
    }],
    ['load', {
        name: 'load',
        returnType: 'void',
        parameters: [{ name: 'url_or_file', type: 'string' }],
        description: 'Sets a path for the display.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/load.html'
    }],
    ['log10', {
        name: 'log10',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Calculates the decimal logarithm',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/log10.html'
    }],
    ['LoginDialog', {
        name: 'LoginDialog',
        returnType: 'void',
        parameters: [],
        description: 'The function is used by LogoutDialog() to start the login dialog.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/LoginDialog.html'
    }],
    ['LogoutDialog', {
        name: 'LogoutDialog',
        returnType: 'void',
        parameters: [],
        description: 'The function is used to open the logout dialog and to go to a new login dialog.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/LogoutDialog.html'
    }],
    ['makeATime', {
        name: 'makeATime',
        returnType: 'atime',
        parameters: [{ name: 't', type: 'time' }, { name: 'count', type: 'int' }, { name: 'dp', type: 'string' }],
        description: 'Returns an alert time in an internal time format incl. DP Identification.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeATime.html'
    }],
    ['makeDynAnytype', {
        name: 'makeDynAnytype',
        returnType: 'dyn_anytype',
        parameters: [{ name: 'x1', type: '[anytype' }, { name: 'x2...]', type: 'dyn_anytype' }],
        description: 'The function returns an dyn_anytype with n (n = the number of defined elements) elements.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynAnytype.html'
    }],
    ['makeDynATime', {
        name: 'makeDynATime',
        returnType: 'dyn_atime',
        parameters: [{ name: 'a1', type: '[ atime' }, { name: 'a2', type: 'atime' }],
        description: 'Returns a dynamic field of alert times.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynATime.html'
    }],
    ['makeDynBit32', {
        name: 'makeDynBit32',
        returnType: 'dyn_bit32',
        parameters: [{ name: 'x1', type: '[bit32' }, { name: 'x2...]', type: 'bit32' }],
        description: 'Returns a dynamic field of 32 bit streams.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynBit32.html'
    }],
    ['makeDynBit64', {
        name: 'makeDynBit64',
        returnType: 'dyn_bit64',
        parameters: [{ name: 'x1', type: '[bit64' }, { name: 'x2...]', type: 'bit64' }],
        description: 'Returns a dynamic field of 64 bit streams.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynBit64.html'
    }],
    ['makeDynBool', {
        name: 'makeDynBool',
        returnType: 'dyn_bool',
        parameters: [{ name: 'x1', type: '[ bool' }, { name: 'x2...]', type: 'bool' }],
        description: 'Returns a dynamic field of bits.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynBool.html'
    }],
    ['makeDynChar', {
        name: 'makeDynChar',
        returnType: 'dyn_char',
        parameters: [{ name: 'x1', type: '[ char' }, { name: 'x2...]', type: 'char' }],
        description: 'Returns a dynamic field of characters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynChar.html'
    }],
    ['makeDynFloat', {
        name: 'makeDynFloat',
        returnType: 'dyn_float',
        parameters: [{ name: 'x1', type: '[ float' }, { name: 'x2...]', type: 'float' }],
        description: 'Returns a dynamic field of floating-point numbers.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynFloat.html'
    }],
    ['makeDynInt', {
        name: 'makeDynInt',
        returnType: 'dyn_int',
        parameters: [{ name: 'x1', type: '[ int' }, { name: 'x2...]', type: 'int' }],
        description: 'Returns a dynamic field of integers.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynInt.html'
    }],
    ['makeDynLong', {
        name: 'makeDynLong',
        returnType: 'dyn_long',
        parameters: [{ name: 'x1', type: '[ long' }, { name: 'x2...]', type: 'long' }],
        description: 'Returns a dynamic field of integers (64 bit).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynLong.html'
    }],
    ['makeDynMixed', {
        name: 'makeDynMixed',
        returnType: 'mixed',
        parameters: [{ name: 'x1', type: '[mixed' }, { name: 'x2...]', type: 'mixed' }],
        description: 'The function returns a mix with n (n = the number of defined elements) elements.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynMixed.html'
    }],
    ['makeDynShape', {
        name: 'makeDynShape',
        returnType: 'dyn_shape',
        parameters: [{ name: 's1', type: '[shape' }, { name: 's2', type: 'shape' }],
        description: 'Returns a dynamic array of shapes.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynShape.html'
    }],
    ['makeDynString', {
        name: 'makeDynString',
        returnType: 'dyn_string',
        parameters: [{ name: 'x1', type: '[ string' }, { name: 'x2...]', type: 'string' }],
        description: 'Returns a dynamic field of strings.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynString.html'
    }],
    ['makeDynTime', {
        name: 'makeDynTime',
        returnType: 'dyn_time',
        parameters: [{ name: 'x1', type: '[ time' }, { name: 'x2...]', type: 'time' }],
        description: 'Returns a dynamic array of internal times.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynTime.html'
    }],
    ['makeDynUInt', {
        name: 'makeDynUInt',
        returnType: 'dyn_uint',
        parameters: [{ name: 'x1', type: '[unsigned' }, { name: 'x2...]', type: 'unsigned' }],
        description: 'Returns a dynamic array of natural numbers.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynUInt.html'
    }],
    ['makeDynULong', {
        name: 'makeDynULong',
        returnType: 'dyn_ulong',
        parameters: [{ name: 'x1', type: '[ulong' }, { name: 'x2...]', type: 'ulong' }],
        description: 'Returns a dynamic field of natural integers (64 bit).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeDynULong.html'
    }],
    ['makeError', {
        name: 'makeError',
        returnType: 'errClass',
        parameters: [{ name: 'bit[', type: '[bit32' }, { name: 'prio[', type: 'int' }, { name: 'type[', type: 'int' }, { name: 'code[', type: 'int' }, { name: '[', type: 'string dp' }, { name: 'man[', type: 'int' }, { name: 'user[', type: 'int' }, { name: 'note1[', type: 'string' }, { name: 'note2[', type: 'string' }, { name: 'note3]]]]]]]]]]]', type: 'string' }],
        description: 'The function returns an error (in an errClass variable) and shows an error message or an information message in accordance with the _errors.cat error message catalog in < wincc_oa_path >/msg/<lang> or an error or information message according to your own error catalog. If you use the first alternative in the example further on, you have to use the _errors.cat catalog. The second alternative allows you to use your own catalog file with your own error or information messages. In this way, the function can be used to handle own errors and to display own error and information messages.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeError.html'
    }],
    ['makeNativePath', {
        name: 'makeNativePath',
        returnType: 'string',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'Converts a file path into a operating system specific file format.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeNativePath.html'
    }],
    ['makeMapping', {
        name: 'makeMapping',
        returnType: 'mapping',
        parameters: [],
        description: 'Creates a mapping with key-value pairs.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeMapping.html'
    }],
    ['makeTime', {
        name: 'makeTime',
        returnType: 'time',
        parameters: [{ name: 'year', type: 'unsigned' }, { name: 'month', type: 'unsigned' }, { name: 'day[', type: 'unsigned' }, { name: 'hour[', type: 'unsigned' }, { name: 'minute[', type: 'unsigned' }, { name: 'second[', type: 'unsigned' }, { name: 'milli[', type: 'unsigned' }, { name: 'daylightsaving]]]]]', type: 'bool' }],
        description: 'Returns a time or alert time in the internal time format.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeTime.html'
    }],
    ['makeUnixPath', {
        name: 'makeUnixPath',
        returnType: 'string',
        parameters: [{ name: 'path', type: 'string' }],
        description: 'Converts a path to a Unix "/" path.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/makeUnixPath.html'
    }],
    ['mappingClear', {
        name: 'mappingClear',
        returnType: 'int',
        parameters: [{ name: 'm', type: 'mapping', byRef: true }],
        description: 'Deletes all entries of a mapping.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mappingClear.html'
    }],
    ['mappingGetKey', {
        name: 'mappingGetKey',
        returnType: 'type>',
        parameters: [{ name: 'm', type: 'mapping' }, { name: 'idx', type: 'int' }],
        description: 'Returns the key with a specified index.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mappingGetKey.html'
    }],
    ['mappingGetValue', {
        name: 'mappingGetValue',
        returnType: 'type>',
        parameters: [{ name: 'm', type: 'mapping' }, { name: 'idx', type: 'int' }],
        description: 'Returns the value (of a mapping) with a specified index.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mappingGetValue.html'
    }],
    ['mappingHasKey', {
        name: 'mappingHasKey',
        returnType: 'bool',
        parameters: [{ name: 'm', type: 'mapping' }, { name: 'key', type: '<type>' }],
        description: 'Checks if the "key" exists in a mapping.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mappingHasKey.html'
    }],
    ['mappingKeys', {
        name: 'mappingKeys',
        returnType: 'dyn_anytype',
        parameters: [{ name: 'm', type: 'mapping' }],
        description: 'Returns an array with all keys of a mapping.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mappingKeys.html'
    }],
    ['mappinglen', {
        name: 'mappinglen',
        returnType: 'int',
        parameters: [{ name: 'm', type: 'mapping' }],
        description: 'Returns the length of a mapping (associative array).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mappinglen.html'
    }],
    ['mappingRemove', {
        name: 'mappingRemove',
        returnType: 'int',
        parameters: [{ name: 'm', type: 'mapping', byRef: true }, { name: 'key', type: '<type>' }],
        description: 'Deletes the entry (of a mapping) with a specified "key".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mappingRemove.html'
    }],
    ['maxFLOAT', {
        name: 'maxFLOAT',
        returnType: 'float',
        parameters: [],
        description: 'Returns the value of the MAX_FLOAT constant: 1.7976931348623e+308.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/maxFLOAT.html'
    }],
    ['maxINT', {
        name: 'maxINT',
        returnType: 'int',
        parameters: [],
        description: 'Returns the value of the MAX_INT constant: 2147483647.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/maxINT.html'
    }],
    ['maxLONG', {
        name: 'maxLONG',
        returnType: 'long',
        parameters: [],
        description: 'Returns the value of the MAX_LONG constant: 9223372036854775807.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/maxLONG.html'
    }],
    ['maxUINT', {
        name: 'maxUINT',
        returnType: 'uint',
        parameters: [],
        description: 'Returns the value of the MAX_UINT constant: 4294967295.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/maxUINT.html'
    }],
    ['maxULONG', {
        name: 'maxULONG',
        returnType: 'ulong',
        parameters: [],
        description: 'Returns the value of the MAX_ULONG constant: 18446744073709551615.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/maxULONG.html'
    }],
    ['milliSecond', {
        name: 'milliSecond',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the milliseconds of a time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/milliSecond.html'
    }],
    ['minFLOAT', {
        name: 'minFLOAT',
        returnType: 'float',
        parameters: [],
        description: 'Returns the value of the MIN_FLOAT constant: -1.7976931348623e+308',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/minFLOAT.html'
    }],
    ['minINT', {
        name: 'minINT',
        returnType: 'int',
        parameters: [],
        description: 'Returns the value of the MIN_INT constant:-2147483648.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/minINT.html'
    }],
    ['minLONG', {
        name: 'minLONG',
        returnType: 'long',
        parameters: [],
        description: 'Returns the value of the MIN_LONG constant: -9223372036854775808.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/minLONG.html'
    }],
    ['minUINT', {
        name: 'minUINT',
        returnType: 'uint',
        parameters: [],
        description: 'Returns the value of the MIN_UINT constant: 0.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/minUINT.html'
    }],
    ['minULONG', {
        name: 'minULONG',
        returnType: 'ulong',
        parameters: [],
        description: 'Returns the value of the MIN_ULONG constant: 0.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/minULONG.html'
    }],
    ['minute', {
        name: 'minute',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the minutes of a time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/minute.html'
    }],
    ['mkdir', {
        name: 'mkdir',
        returnType: 'bool',
        parameters: [{ name: 'dir', type: 'string' }, { name: 'mode', type: 'string', optional: true }],
        description: 'Creates a directory with a specified name.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mkdir.html'
    }],
    ['moduleAddAction', {
        name: 'moduleAddAction',
        returnType: 'int',
        parameters: [{ name: 'label', type: 'string' }, { name: 'icon', type: 'string' }, { name: 'shortcut', type: 'string' }, { name: 'menu', type: 'int' }, { name: 'toolbar', type: 'int' }, { name: 'function', type: 'string' }],
        description: 'Adds a new action to a self-created menu in the Script Editor or module GEDI.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleAddAction.html'
    }],
    ['moduleAddDockModule', {
        name: 'moduleAddDockModule',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }, { name: 'panelFile', type: 'string' }, { name: 'dollars', type: 'dyn_string', optional: true }, { name: 'options]', type: 'mapping' }],
        description: 'Adds a new dock module to a GEDI or VISION module or to the Script Editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleAddDockModule.html'
    }],
    ['moduleAddMenu', {
        name: 'moduleAddMenu',
        returnType: 'int',
        parameters: [],
        description: 'Adds a new menu to Script Editor or GEDI module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleAddMenu.html'
    }],
    ['moduleAddSubMenu', {
        name: 'moduleAddSubMenu',
        returnType: 'int',
        parameters: [{ name: 'label', type: 'string' }, { name: 'parentMenu', type: 'int' }],
        description: 'Adds a new submenu to the Script Editor or GEDI module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleAddSubMenu.html'
    }],
    ['moduleAddToolBar', {
        name: 'moduleAddToolBar',
        returnType: 'int',
        parameters: [{ name: 'label', type: 'string' }],
        description: 'Adds a new toolbar to the Script Editor or GEDImodule.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleAddToolBar.html'
    }],
    ['moduleGetAction', {
        name: 'moduleGetAction',
        returnType: 'anytype',
        parameters: [{ name: 'id', type: 'int' }, { name: 'attribute', type: 'string' }],
        description: 'Returns the state of a selected attribute for a menu entry.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleGetAction.html'
    }],
    ['moduleHide', {
        name: 'moduleHide',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'The given module is used as a initial point to search for the top level window that is then hidden. In case of an embedded module, it will not be hidden, but instead its container module window will be.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleHide.html'
    }],
    ['moduleLower', {
        name: 'moduleLower',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'Replaces the function lowerModule() as of the version 3.8.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleLower.html'
    }],
    ['moduleMaximize', {
        name: 'moduleMaximize',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'The given module is used as a initial point to search for the top level window that is then maximized (titlebar and taskbar will be displayed). In case of an embedded module, not the embedded module but its container module will be maximized.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleMaximize.html'
    }],
    ['moduleMinimize', {
        name: 'moduleMinimize',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'The given module is used as a initial point to search for the top level window that is then minimized. In case of an embedded module, it will not be minimized, but instead its container module window will be.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleMinimize.html'
    }],
    ['moduleSetAction', {
        name: 'moduleSetAction',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'int' }, { name: 'attribute', type: 'string' }, { name: 'value', type: 'anytype' }],
        description: 'Changes a selected attribute state of a menu or sub-menu entry, which was added using moduleAddAction().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleSetAction.html'
    }],
    ['moduleOff', {
        name: 'moduleOff',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'Closes a module without connection to the Event Manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleOff_unconnected.html'
    }],
    ['ModuleOff', {
        name: 'ModuleOff',
        returnType: 'void',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'Closes a module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ModuleOff.html'
    }],
    ['moduleOn', {
        name: 'moduleOn',
        returnType: 'int',
        parameters: [{ name: 'params', type: 'dyn_anytype' }],
        description: 'Opens a new module without connection to the event manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleOn_unconnected.html'
    }],
    ['ModuleOn', {
        name: 'ModuleOn',
        returnType: 'void',
        parameters: [{ name: 'y', type: 'unsigned' }, { name: 'w', type: 'unsigned' }, { name: 'h', type: 'unsigned' }, { name: 'ModuleType', type: 'int' }],
        description: 'Opens a new module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ModuleOn.html'
    }],
    ['ModuleOnWithPanel', {
        name: 'ModuleOnWithPanel',
        returnType: 'void',
        parameters: [],
        description: 'This function opens a new module containing the specified root panel in the right size.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ModuleOnWithPanel.html'
    }],
    ['moduleOriginalSize', {
        name: 'moduleOriginalSize',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string', optional: true }],
        description: 'Resizes the panel to its original size.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleOriginalSize.html'
    }],
    ['moduleRaise', {
        name: 'moduleRaise',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'Replaces the function raiseModule() as of the version 3.8.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleRaise.html'
    }],
    ['moduleResizeDocks', {
        name: 'moduleResizeDocks',
        returnType: 'int',
        parameters: [{ name: 'modules', type: 'dyn_string' }, { name: 'sizes', type: 'dyn_int' }, { name: 'orientation', type: 'string' }],
        description: 'Resizes the listed modules to the listed sizes.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleResizeDocks.html'
    }],
    ['moduleRestore', {
        name: 'moduleRestore',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'The given module is used as an initial point to search for the top level window that is then restored. In case of an embedded module, it will not be restored, but instead its container module window will be.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleRestore.html'
    }],
    ['moduleSetAction', {
        name: 'moduleSetAction',
        returnType: 'int',
        parameters: [{ name: 'state', type: 'blob' }],
        description: 'Restores the settings of the mainwindows toolbars and dockwidgets from a blob.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleRestoreState.html'
    }],
    ['moduleSaveState', {
        name: 'moduleSaveState',
        returnType: 'blob',
        parameters: [],
        description: 'Saves the current state of the mainmodules toolbars and dockwidgets. See moduleRestoreState() to reapply the state.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleSaveState.html'
    }],
    ['moduleShow', {
        name: 'moduleShow',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'The given module is used as a initial point to search for the top level window that is then shown. In case of an embedded module, it will not be shown, but instead its container module window will be.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleShow.html'
    }],
    ['moduleShowFullScreen', {
        name: 'moduleShowFullScreen',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }],
        description: 'The given module is used as a initial point to search for the top level window that is then enlarged to full screen (titlebar and taskbar are hidden). In case of an embedded module, not the embedded module but its container module will be enlarged.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moduleShowFullScreen.html'
    }],
    ['month', {
        name: 'month',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the month of a time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/month.html'
    }],
    ['moveFile', {
        name: 'moveFile',
        returnType: 'void',
        parameters: [],
        description: 'Moves the specified file or directory to the target directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moveFile.html'
    }],
    ['moveModule', {
        name: 'moveModule',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }, { name: 'xpos', type: 'int' }, { name: 'ypos', type: 'int' }],
        description: 'Moves a module to an arbitrary position on the screen.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/moveModule.html'
    }],
    ['mpGetMasterDpeForDpe', {
        name: 'mpGetMasterDpeForDpe',
        returnType: 'string',
        parameters: [{ name: 'dpe', type: 'string' }],
        description: 'Returns the master datapoint for the given DP.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mpGetMasterDpeForDpe.html'
    }],
    ['mpHasDpeConfig', {
        name: 'mpHasDpeConfig',
        returnType: 'bool',
        parameters: [{ name: 'dpe', type: 'string' }, { name: 'config', type: 'string' }],
        description: 'Checks whether the given datapoint possesses a specific config or not.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/mpHasDpeConfig.html'
    }],
    ['msc_createFav', {
        name: 'msc_createFav',
        returnType: 'void',
        parameters: [],
        description: 'This function should be implemented if you close a user interface and want to save the last screen configuration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/msc_createFav.html'
    }],
    ['msc_FavMenu', {
        name: 'msc_FavMenu',
        returnType: 'void',
        parameters: [],
        description: 'This function opens a popup menu with all favourites of the current user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/msc_FavMenu.html'
    }],
    ['msc_movePanel', {
        name: 'msc_movePanel',
        returnType: 'void',
        parameters: [],
        description: 'You can use the function to move a panel to an arbitrary screen.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/msc_movePanel.html'
    }],
    ['msc_moveToNextScreen', {
        name: 'msc_moveToNextScreen',
        returnType: 'void',
        parameters: [],
        description: 'You can use the function to move a panel to the next screen.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/msc_moveToNextScreen.html'
    }],
    ['msc_moveToPrevScreen', {
        name: 'msc_moveToPrevScreen',
        returnType: 'void',
        parameters: [],
        description: 'You can use the function to move a panel to the previous screen.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/msc_moveToPrevScreen.html'
    }],
    ['msgCatEditor', {
        name: 'msgCatEditor',
        returnType: 'int',
        parameters: [{ name: 'catalog', type: 'string' }],
        description: 'The function opens the catalog editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/msgCatEditor.html'
    }],
    ['myDisplayName', {
        name: 'myDisplayName',
        returnType: 'string',
        parameters: [{ name: 'formatVersion', type: 'int', optional: true }],
        description: 'Returns the display the user is currently using.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myDisplayName.html'
    }],
    ['myManId', {
        name: 'myManId',
        returnType: 'int',
        parameters: [],
        description: 'Returns the manager ID as a number. The number contains coded the system, replica, type and number.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myManId.html'
    }],
    ['myManNum', {
        name: 'myManNum',
        returnType: 'unsigned',
        parameters: [],
        description: 'Returns the manager number of the UI manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myManNum.html'
    }],
    ['myManType', {
        name: 'myManType',
        returnType: 'unsigned',
        parameters: [],
        description: 'Returns the type of the current manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myManType.html'
    }],
    ['myModuleName', {
        name: 'myModuleName',
        returnType: 'string',
        parameters: [],
        description: 'Returns the name of the current module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myModuleName.html'
    }],
    ['myPanelName', {
        name: 'myPanelName',
        returnType: 'string',
        parameters: [],
        description: 'Returns the name of the current panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myPanelName.html'
    }],
    ['myReduHost', {
        name: 'myReduHost',
        returnType: 'string',
        parameters: [],
        description: 'Returns the host name of the Event Manager this manager is connected to.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myReduHost.html'
    }],
    ['myReduHostNum', {
        name: 'myReduHostNum',
        returnType: 'int',
        parameters: [],
        description: 'Returns 1 or 2 (host number) in a redundant system depending on the connection to the Event Manager (manager 1 or 2) (for example, eventHost = "host1$host2"). In a non-redundant configuration it always returns 1.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myReduHostNum.html'
    }],
    ['myUiDpName', {
        name: 'myUiDpName',
        returnType: 'string',
        parameters: [],
        description: 'Returns the name of the user interface datapoint.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myUiDpName.html'
    }],
    ['myUiNumber', {
        name: 'myUiNumber',
        returnType: 'int',
        parameters: [],
        description: 'Returns the number of the UI manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myUiNumber.html'
    }],
    ['myWindowId', {
        name: 'myWindowId',
        returnType: 'int',
        parameters: [],
        description: 'Returns the identification number of the current window.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/myWindowId.html'
    }],
    ['nameCheck', {
        name: 'nameCheck',
        returnType: 'int',
        parameters: [{ name: 'dpName', type: 'string', byRef: true }, { name: 'nameType]', type: 'int' }],
        description: 'Checks if the name of a datapoint or name of a project only contains the permitted characters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/nameCheck.html'
    }],
    ['netDelete', {
        name: 'netDelete',
        returnType: 'int',
        parameters: [{ name: 'url', type: 'string' }, { name: 'result', type: 'mapping|string|blob', byRef: true }, { name: 'options]', type: 'mapping' }],
        description: 'The function requests to delete the resource, which was identified by the URL.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/netDelete.html'
    }],
    ['netGet', {
        name: 'netGet',
        returnType: 'int',
        parameters: [{ name: 'url', type: 'string' }, { name: 'result', type: 'mapping|string|blob', byRef: true }, { name: 'options]', type: 'mapping' }],
        description: 'The function netGet allows to download data.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/netGet.html'
    }],
    ['netHead', {
        name: 'netHead',
        returnType: 'int',
        parameters: [{ name: 'url', type: 'string' }, { name: 'result', type: 'mapping', byRef: true }, { name: 'options]', type: 'mapping' }],
        description: 'The function netHead allows you to download data. The function is very similar to netGet(), but only queries headers and does not receive any content.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/netHead.html'
    }],
    ['netPost', {
        name: 'netPost',
        returnType: 'int',
        parameters: [{ name: 'url', type: 'string' }, { name: '[', type: 'mapping|string|blob data' }, { name: 'result]', type: 'mapping|string|blob', byRef: true }],
        description: 'The function netPost allows to upload data to a server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/netPost.html'
    }],
    ['netPut', {
        name: 'netPut',
        returnType: 'int',
        parameters: [{ name: 'url', type: 'string' }, { name: '[', type: 'mapping|string|blob data' }, { name: 'result]', type: 'mapping|string|blob', byRef: true }],
        description: 'The function netPut() allows you to upload data to a server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/netPut.html'
    }],
    ['numberMatch', {
        name: 'numberMatch',
        returnType: 'bool',
        parameters: [{ name: 'pattern', type: 'string' }, { name: 'number', type: 'int' }],
        description: 'Checks whether a number falls into a particular range.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/numberMatch.html'
    }],
    ['OPCEnumQuery', {
        name: 'OPCEnumQuery',
        returnType: 'int',
        parameters: [{ name: 'type', type: 'int' }, { name: 'in', type: 'dyn_string' }, { name: 'out', type: 'dyn_string', byRef: true }],
        description: 'Function for browsing registered OPC servers. This function is used for the simple OPC client configuration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/OPCEnumQuery.html'
    }],
    ['openAES', {
        name: 'openAES',
        returnType: 'int',
        parameters: [{ name: 'screenConfig', type: 'string' }, { name: 'module', type: 'string' }, { name: 'action', type: 'int' }, { name: 'fileName', type: 'string', optional: true }, { name: 'xPos', type: 'int' }, { name: 'yPos', type: 'int' }],
        description: 'Opens the alert and event panel at the desired position and allows executing an action such as print the upper table of the alert and event panel or save the table.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Alert_Event_Panel/openAES.html'
    }],
    ['openDialog', {
        name: 'openDialog',
        returnType: 'int',
        parameters: [{ name: '[', type: 'string panel' }, { name: '[', type: 'dyn_string subst' }, { name: 'result]]', type: 'mapping', byRef: true }],
        description: 'Opens a dialog for simple configuration.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/openDialog.html'
    }],
    ['openHelpViewer', {
        name: 'openHelpViewer',
        returnType: 'int',
        parameters: [{ name: 'url', type: 'string' }],
        description: 'The function opens the Help Viewer.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/openHelpViewer.html'
    }],
    ['openLogViewer', {
        name: 'openLogViewer',
        returnType: 'int',
        parameters: [{ name: 'docked', type: 'bool' }],
        description: 'Opens the Log Viewer.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/openLogViewer.html'
    }],
    ['openProgressBar', {
        name: 'openProgressBar',
        returnType: 'void',
        parameters: [{ name: 'sHeader', type: 'string' }, { name: 'sIcon', type: 'string' }, { name: 'text1', type: 'string' }, { name: 'text2', type: 'string' }, { name: 'text3', type: 'string' }, { name: 'iSliderType', type: 'int' }],
        description: 'Displays a module with the defined parameters for a progress bar.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/openProgressBar.html'
    }],
    ['openTrend', {
        name: 'openTrend',
        returnType: 'void',
        parameters: [{ name: 'trendGroup', type: 'string' }, { name: 'trendType', type: 'int' }],
        description: 'Opens a predefined trend group.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/openTrend.html'
    }],
    ['openTrendCurves', {
        name: 'openTrendCurves',
        returnType: 'void',
        parameters: [{ name: 'trendName', type: 'string' }, { name: 'trendType', type: 'int' }, { name: 'Curves', type: 'dyn_string' }, { name: 'sModuleAndPanel', type: 'string' }],
        description: 'Opens a trend with a configuration trendName and replaces the curves that contain a dollar parameter.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/openTrendCurves.html'
    }],
    ['paCfgDeleteValue', {
        name: 'paCfgDeleteValue',
        returnType: 'int',
        parameters: [{ name: 'filename', type: 'string' }, { name: 'section', type: 'string' }, { name: '[', type: 'string key' }, { name: '[', type: '<type> value' }, { name: 'host]]', type: 'string' }],
        description: 'The function deletes the first occurrence (top down) of the specified key (config entry) or key/value pair from the specified section in the config file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/paCfgDeleteValue.html'
    }],
    ['paCfgInsertValue', {
        name: 'paCfgInsertValue',
        returnType: 'int',
        parameters: [{ name: 'filename', type: 'string' }, { name: 'section', type: 'string' }, { name: 'key', type: 'string' }, { name: '[', type: '<type> value' }, { name: 'host]', type: 'string' }],
        description: 'The function adds a key (Config entry) /value (value of the config entry) pair to a specified section of the config file. You can also add the entry/value pair before or after the first or last search key (the search key is a specified config entry), before the first value (see the parameter table below).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/paCfgInsertValue.html'
    }],
    ['paCfgReadValue', {
        name: 'paCfgReadValue',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'dyn_string', optional: true }, { name: 'section', type: 'string' }, { name: 'key', type: 'string' }, { name: 'value[', type: '<type>', byRef: true }, { name: 'host]', type: 'string' }],
        description: 'The function reads the value of a specified entry in a config file section. If there are several identical values, only the last one will be read.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/paCfgReadValue.html'
    }],
    ['paCfgReadValueDflt', {
        name: 'paCfgReadValueDflt',
        returnType: 'type>',
        parameters: [{ name: 'filename', type: 'string' }, { name: 'section', type: 'string' }, { name: 'key', type: 'string' }, { name: 'dfltValue[', type: '<type>' }, { name: 'isDflt', type: 'bool', byRef: true }, { name: 'host]]', type: 'string' }],
        description: 'The function returns either the value of the found entry or the default value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/paCfgReadValueDflt.html'
    }],
    ['paCfgReadValueList', {
        name: 'paCfgReadValueList',
        returnType: 'int',
        parameters: [{ name: 'filename', type: 'string' }, { name: 'section', type: 'string' }, { name: 'key', type: 'string' }, { name: 'value[', type: 'dyn_string', byRef: true }, { name: 'separator[', type: 'string' }, { name: 'host]]', type: 'string' }],
        description: 'The function reads all values of a config entry that exist more than once in a config file. The function can be used, for example, for reading the values of the proj_path entry, the LoadCtrlLibs entry or others.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/paCfgReadValueList.html'
    }],
    ['paIsRunAsAdmin', {
        name: 'paIsRunAsAdmin',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks if the process of the project administration is running with administrative privileges.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/paIsRunAsAdmin.html'
    }],
    ['panelFileName', {
        name: 'panelFileName',
        returnType: 'string',
        parameters: [{ name: 'moduleName', type: 'string' }, { name: 'panelName', type: 'string' }],
        description: 'Returns the relative panel file name, for example, "vision/login.pnl"',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/panelFileName.html'
    }],
    ['PanelOffModule', {
        name: 'PanelOffModule',
        returnType: 'void',
        parameters: [],
        description: 'Closes a panel in a specific module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/PanelOffModule.html'
    }],
    ['PanelOffPanel', {
        name: 'PanelOffPanel',
        returnType: 'void',
        parameters: [],
        description: 'Closes a particular panel',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/PanelOffPanel.html'
    }],
    ['PanelOffReturn', {
        name: 'PanelOffReturn',
        returnType: 'void',
        parameters: [],
        description: 'Needed for closing a child panel with a return value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/PanelOffReturn.html'
    }],
    ['panelPosition', {
        name: 'panelPosition',
        returnType: 'int',
        parameters: [{ name: 'modulName', type: 'string' }, { name: 'panelName', type: 'string' }, { name: 'xPos', type: 'int', byRef: true }, { name: 'yPos', type: 'int', byRef: true }],
        description: 'Returns the position of a panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/panelPosition.html'
    }],
    ['panelSelector', {
        name: 'panelSelector',
        returnType: 'int',
        parameters: [{ name: 'panelstr', type: 'string', byRef: true }],
        description: 'Opens the file selection dialog and writes the selected file name to a variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/panelSelector.html'
    }],
    ['panelSize', {
        name: 'panelSize',
        returnType: 'int',
        parameters: [{ name: 'PanelName', type: 'string' }, { name: 'width', type: 'int', byRef: true }, { name: 'height', type: 'int', byRef: true }, { name: 'currentSize', type: 'bool' }],
        description: 'Returns the width and height of a panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/panelSize.html'
    }],
    ['panelZoomIn', {
        name: 'panelZoomIn',
        returnType: 'int',
        parameters: [{ name: '[', type: '[string moduleName' }, { name: 'factor]]', type: 'float' }],
        description: 'Zooms in the rootpanel in a module around the center with the specified zoom factor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/panelZoomIn.html'
    }],
    ['panelZoomOut', {
        name: 'panelZoomOut',
        returnType: 'int',
        parameters: [{ name: '[', type: '[string moduleName' }, { name: 'factor]]', type: 'float' }],
        description: 'Zooms out the rootpanel in a module around the center with a specified zoom factor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/panelZoomOut.html'
    }],
    ['panningMode', {
        name: 'panningMode',
        returnType: 'int',
        parameters: [{ name: '[', type: 'bool bFlag' }, { name: 'moduleName]', type: 'string' }],
        description: 'Activates or deactivates the function for displacing the root panel in a module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/panningMode.html'
    }],
    ['PasswordDialog', {
        name: 'PasswordDialog',
        returnType: 'void',
        parameters: [],
        description: 'Opens a dialog for changing the password of the current user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/PasswordDialog.html'
    }],
    ['patternMatch', {
        name: 'patternMatch',
        returnType: 'dyn_bool',
        parameters: [{ name: 'pattern', type: 'string' }, { name: 'ds', type: 'string s | dyn_string' }],
        description: 'Checks whether a string has a particular pattern.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/patternMatch.html'
    }],
    ['pause', {
        name: 'pause',
        returnType: 'void',
        parameters: [],
        description: 'Pauses the playback.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pause.html'
    }],
    ['period', {
        name: 'period',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the seconds of a time t that have elapsed since 1.1.1970, 00:00 (UTC).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/period.html'
    }],
    ['pmonGetCount', {
        name: 'pmonGetCount',
        returnType: 'int',
        parameters: [],
        description: 'The function pmonGetCount() returns the number of managers defined.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetCount.html'
    }],
    ['pmonGetName', {
        name: 'pmonGetName',
        returnType: 'string',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetName() returns the name of the WinCC OA manager that corresponds to the specified index.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetName.html'
    }],
    ['pmonGetNum', {
        name: 'pmonGetNum',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetNum() returns the number of a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetNum.html'
    }],
    ['pmonGetOptions', {
        name: 'pmonGetOptions',
        returnType: 'string',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetOptions() returns the manager options of a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetOptions.html'
    }],
    ['pmonGetPID', {
        name: 'pmonGetPID',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetPID() returns the process ID of a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetPID.html'
    }],
    ['pmonGetResetMinutes', {
        name: 'pmonGetResetMinutes',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetResetMinutes() returns the reset minutes set for a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetResetMinutes.html'
    }],
    ['pmonGetRestartCount', {
        name: 'pmonGetRestartCount',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetRestartCount() returns the number of restarts set for a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetRestartCount.html'
    }],
    ['pmonGetSecondsToKill', {
        name: 'pmonGetSecondsToKill',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetSecondsToKill() returns the set "seconds to kill" for a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetSecondsToKill.html'
    }],
    ['pmonGetStartMode', {
        name: 'pmonGetStartMode',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetStartMode() returns the start mode of a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetStartMode.html'
    }],
    ['pmonGetStartTime', {
        name: 'pmonGetStartTime',
        returnType: 'time',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetStartTime() returns the start time of a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetStartTime.html'
    }],
    ['pmonGetState', {
        name: 'pmonGetState',
        returnType: 'int',
        parameters: [{ name: 'idx', type: 'int' }],
        description: 'The function pmonGetState() returns the manager state of a WinCC OA manager.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonGetState.html'
    }],
    ['pmonStartModeToStr', {
        name: 'pmonStartModeToStr',
        returnType: 'string',
        parameters: [{ name: 'startMode', type: 'int' }],
        description: 'The function pmonStartModeToStr() converts a manager start mode of a WinCC OA manager into string format.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pmonStartModeToStr.html'
    }],
    ['popupMenu', {
        name: 'popupMenu',
        returnType: 'int',
        parameters: [{ name: 'text', type: 'dyn_string' }, { name: 'answer', type: 'int', byRef: true }],
        description: 'Activating a context-sensitive menu by means of right-clicking.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/popupMenu.html'
    }],
    ['popupMenuXY', {
        name: 'popupMenuXY',
        returnType: 'int',
        parameters: [{ name: 'text', type: 'dyn_string' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }, { name: 'answer', type: 'int', byRef: true }, { name: '[', type: 'string font' }, { name: '[', type: 'string forecol' }, { name: 'backcol]]]', type: 'string' }],
        description: 'Opens a pop-up menu in a specific position.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/popupMenuXY.html'
    }],
    ['popupMessage', {
        name: 'popupMessage',
        returnType: 'void',
        parameters: [{ name: 'uiDp', type: 'string' }, { name: '[', type: 'langString msgText' }, { name: 'msgNo]', type: 'unsigned' }],
        description: 'Sends a pop-up message to the desired user interface. With this function you can send messages to other "foreign" user interfaces.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/popupMessage.html'
    }],
    ['pow', {
        name: 'pow',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }, { name: 'y', type: 'float' }],
        description: 'Returns x y.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pow.html'
    }],
    ['printPanel', {
        name: 'printPanel',
        returnType: 'int',
        parameters: [{ name: 'modulName', type: 'string' }, { name: 'panelName', type: 'string' }, { name: 'spec', type: 'string' }, { name: 'options', type: 'int' }],
        description: 'Prints a panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/printPanel.html'
    }],
    ['printPanel', {
        name: 'printPanel',
        returnType: 'int',
        parameters: [{ name: 'modulName', type: 'string' }, { name: 'panelName', type: 'string' }, { name: 'spec', type: 'string' }, { name: 'options', type: 'int' }],
        description: 'Prints a panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/printPanel.html'
    }],
    ['printTable', {
        name: 'printTable',
        returnType: 'int',
        parameters: [{ name: 'shapeName', type: '[string|shape' }, { name: 'options', type: '[mapping' }, { name: 'showDialog', type: '[bool' }, { name: 'header', type: '[dyn_string' }, { name: 'footer', type: '[dyn_string' }, { name: 'columnsType', type: '[int' }, { name: 'columns', type: '[dyn_string | dyn_int' }, { name: 'fitToWidth', type: '[bool' }, { name: 'landscape', type: '[bool' }, { name: 'gridLines', type: '[bool' }, { name: 'gridBackground', type: '[bool' }, { name: 'margin', type: '[dyn_int' }, { name: 'printerName', type: '[string' }, { name: 'printFont]]]...', type: 'string', optional: true }],
        description: 'This function prints a table.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/printTable.html'
    }],
    ['projectTranslationUnload', {
        name: 'projectTranslationUnload',
        returnType: 'int',
        parameters: [],
        description: 'This function tells the manager to unload all currently loaded translation files.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/projectTranslationUnload.html'
    }],
    ['projectTranslationUpdate', {
        name: 'projectTranslationUpdate',
        returnType: 'int',
        parameters: [{ name: 'options', type: 'mapping' }],
        description: 'Scans all panels and scripts from one project level and updates the translation file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/projectTranslationUpdate.html'
    }],
    ['pt_buildModuleName', {
        name: 'pt_buildModuleName',
        returnType: 'string',
        parameters: [{ name: 'sModuleName', type: 'string' }, { name: 'iModuleNumber', type: 'int' }],
        description: 'The function is used in conjunction with panel topology when a multi-monitor mode has been chosen. The function creates a module with the specified name and number.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pt_buildModuleName.html'
    }],
    ['pt_moduleNumber', {
        name: 'pt_moduleNumber',
        returnType: 'void',
        parameters: [],
        description: 'The function is used in conjunction with panel topology when a multi-monitor mode has been chosen. The function creates a mainModule & 2 from "mainModule_2".',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pt_moduleNumber.html'
    }],
    ['pt_panelOn', {
        name: 'pt_panelOn',
        returnType: 'void',
        parameters: [],
        description: 'The function is used in conjunction with panel topology and opens a panel in a module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pt_panelOn.html'
    }],
    ['ptms_LoadOneBasePanel', {
        name: 'ptms_LoadOneBasePanel',
        returnType: 'void',
        parameters: [{ name: 'iScreenNr', type: 'int' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }, { name: 'iWidth', type: 'int' }, { name: 'iHeight', type: 'int' }, { name: 'cScreen', type: 'char' }, { name: 'strBasepanel', type: 'string' }, { name: 'strTemplate', type: 'string' }, { name: 'iNode', type: 'int' }],
        description: 'If two base panels are started on two monitors and the base panel will be closed on one of the monitors, the function ptms_LoadOneBasePanel can be used to reopen the base panel on this monitor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/ptms_LoadOneBasePanel.html'
    }],
    ['pvAddColumn', {
        name: 'pvAddColumn',
        returnType: 'void',
        parameters: [],
        description: 'Adds a column with the specified label to the project view.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pvAddColumn.html'
    }],
    ['pvAddSeparator', {
        name: 'pvAddSeparator',
        returnType: 'int',
        parameters: [{ name: 'parent', type: 'string' }],
        description: 'Adds a separator between two options of the context menu in the project view. It is not possible to set a separator behind the last menu option or before the first menu option. Also it is possible to set only one separator between two options. If this function is used in the script between the same options multiple times, anyhow, only one separator will be shown in the context menu.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pvAddSeparator.html'
    }],
    ['pvAddSubMenu', {
        name: 'pvAddSubMenu',
        returnType: 'int',
        parameters: [{ name: 'label', type: 'string' }, { name: 'id', type: 'string' }, { name: 'options]', type: 'mapping' }],
        description: 'Adds a submenu.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pvAddSubMenu.html'
    }],
    ['pvConnect', {
        name: 'pvConnect',
        returnType: 'int',
        parameters: [{ name: 'funcName', type: 'string' }, { name: 'label[', type: 'string' }, { name: 'options]', type: 'string icon | mapping' }],
        description: 'Calls the specified function with the specified label.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pvConnect.html'
    }],
    ['pvSetItemProperties', {
        name: 'pvSetItemProperties',
        returnType: 'void',
        parameters: [],
        description: 'Sets the font and color for a file in a specific column.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pvSetItemProperties.html'
    }],
    ['pvSetItemText', {
        name: 'pvSetItemText',
        returnType: 'void',
        parameters: [],
        description: 'Sets an item text for a file in a specific column.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/pvSetItemText.html'
    }],
    ['quarter', {
        name: 'quarter',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the quarter portion of a time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/quarter.html'
    }],
    ['rad2deg', {
        name: 'rad2deg',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Converts an angle from a radian measure into degrees.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/rad2deg.html'
    }],
    ['rand', {
        name: 'rand',
        returnType: 'unsigned',
        parameters: [],
        description: 'Calculates a sequence of integer pseudo random numbers.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/rand.html'
    }],
    ['readSMS', {
        name: 'readSMS',
        returnType: 'void',
        parameters: [],
        description: 'The readSMS() function reads a SMS message with the phone number of the sender and the time when the message has been sent. Possible errors will be read as well. If you want to use the control function, the runtime script sms.ctl has to run in the console.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/readSMS.html'
    }],
    ['reduActive', {
        name: 'reduActive',
        returnType: 'int',
        parameters: [{ name: 'iAnswer', type: 'int', byRef: true }, { name: 'sSystem', type: 'string' }],
        description: 'In a redundant system, returns the active computer.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reduActive.html'
    }],
    ['reduSetActive', {
        name: 'reduSetActive',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }, { name: 'bAsk', type: 'bool' }],
        description: 'Activates the emergency switch on the left or on the right.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reduSetActive.html'
    }],
    ['reduSetInactive', {
        name: 'reduSetInactive',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }, { name: 'bAsk', type: 'bool' }],
        description: 'Deactivates the emergency switch on the left or on the right in a redundant system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reduSetInactive.html'
    }],
    ['reduSetPreferred', {
        name: 'reduSetPreferred',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }, { name: 'bAsk', type: 'bool' }],
        description: 'Sets the Preferred to left or right in a redundant system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reduSetPreferred.html'
    }],
    ['reduSetSplitOff', {
        name: 'reduSetSplitOff',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'bAsk', type: 'bool' }, { name: 'stayHost', type: 'int' }],
        description: 'Sets the split mode to off in a redundant project.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reduSetSplitOff.html'
    }],
    ['reduSetSplitOn', {
        name: 'reduSetSplitOn',
        returnType: 'void',
        parameters: [],
        description: 'Sets the split mode in a redundant system.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reduSetSplitOn.html'
    }],
    ['reduSwitchDist', {
        name: 'reduSwitchDist',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }, { name: 'bAsk', type: 'bool' }],
        description: 'Switches over in the split mode.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reduSwitchDist.html'
    }],
    ['reduSwichDriver', {
        name: 'reduSwichDriver',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }, { name: 'bAsk', type: 'bool' }],
        description: 'Switches the drivers in the split mode.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reduSwitchDriver.html'
    }],
    ['regexpIndex', {
        name: 'regexpIndex',
        returnType: 'int',
        parameters: [{ name: 'regexp', type: 'string' }, { name: '[', type: 'string line' }, { name: 'options]', type: 'mapping' }],
        description: 'The function "regexpIndex()" provides pattern matching via regular expressions. The function searches for a match of the specified character starting from the given position.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/regexpIndex.html'
    }],
    ['regexpLastIndex', {
        name: 'regexpLastIndex',
        returnType: 'int',
        parameters: [{ name: 'regexp', type: 'string' }, { name: '[', type: 'string line' }, { name: 'options]', type: 'mapping' }],
        description: 'The function "regexpLastIndex()" provides pattern matching via regular expressions. The function searches for a match of the specified character(s) starting at the end of the string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/regexpLastIndex.html'
    }],
    ['regexpReplace', {
        name: 'regexpReplace',
        returnType: 'int',
        parameters: [{ name: 'searchRegExp', type: 'string' }, { name: 'subject', type: 'string', byRef: true }, { name: 'replace[', type: 'string' }, { name: 'options]', type: 'mapping|string' }],
        description: 'The function "regexReplace()" provides a regex-based text replacement.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/regexpReplace.html'
    }],
    ['regexpSplit', {
        name: 'regexpSplit',
        returnType: 'int',
        parameters: [{ name: 'rexexp', type: 'string' }, { name: 'line', type: 'string' }, { name: 'result', type: 'dyn_string', byRef: true }, { name: 'characters', type: 'mapping options; ParameterDescriptionrexexpThe regular expression. For permitted', optional: true }, { name: '"a-z|A-Z+"', type: 'seeQt - Regular Expression - Captured Textsunder "Characters and Abbreviations for Sets of Characters".E.g."a-z|A-Z+".This example searches for letters a-z and A-Z and the + sign searches the letter one or more times meaning the + sign stands for at least one-time repetition. With the expression', optional: true }, { name: 'example', type: 'for' }, { name: 'is0(int', type: 'you can separate letters from numbers.lineThe string that is checked.resultThe result of the search.optionsThe options applied to the split. For the mapping the following keys can be used:startPosition: Set the start position for the search. The default' }],
        description: 'The function "regexpSplit()" provides pattern matching via regular expressions.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/regexpSplit.html'
    }],
    ['registerDbgFlag', {
        name: 'registerDbgFlag',
        returnType: 'int',
        parameters: [{ name: 'name', type: 'string' }],
        description: 'Registers a debug flag and returns a debug flag number.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/registerDbgFlag.html'
    }],
    ['releaseComObject', {
        name: 'releaseComObject',
        returnType: 'int',
        parameters: [{ name: 'obj', type: 'idispatch' }],
        description: 'Releases the COM object.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/releaseComObject.html'
    }],
    ['reloadSecurityEventConfig', {
        name: 'reloadSecurityEventConfig',
        returnType: 'int',
        parameters: [],
        description: 'Function reloads the Security Event JSON configuration file for the local managers and PMON.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/reloadSecurityEventConfig.html'
    }],
    ['recode', {
        name: 'recode',
        returnType: 'string',
        parameters: [{ name: 's', type: 'string' }, { name: 'sourceEncoding', type: 'string' }, { name: 'targetEncoding', type: 'string', optional: true }],
        description: 'The function converts a string and returns the string in the desired encoding.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/recode.html'
    }],
    ['recodeBlob', {
        name: 'recodeBlob',
        returnType: 'blob',
        parameters: [{ name: 's', type: 'blob' }, { name: 'sourceEncoding[', type: 'string' }, { name: 'targetEncoding]', type: 'string' }],
        description: 'The function recodeBlob() recodes a character set, like recode(), but works with a blob.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/recodeBlob.html'
    }],
    ['remove', {
        name: 'remove',
        returnType: 'void',
        parameters: [],
        description: 'The function remove() deletes a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/remove.html'
    }],
    ['removeDoneCB', {
        name: 'removeDoneCB',
        returnType: 'void',
        parameters: [],
        description: 'The function prevents the calculation of unwanted data in datapoint functions and statistical functions.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/removeDoneCB.html'
    }],
    ['removeGlobal', {
        name: 'removeGlobal',
        returnType: 'int',
        parameters: [{ name: 'name', type: 'string' }],
        description: 'Deletes the manager-wide global CTRL variable name.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/removeGlobal.html'
    }],
    ['removeGroup', {
        name: 'removeGroup',
        returnType: 'int',
        parameters: [{ name: 'groupPointer', type: 'shape' }],
        description: 'The function removes a group connection from the panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/removeGroup.html'
    }],
    ['removeGroupPVSS', {
        name: 'removeGroupPVSS',
        returnType: 'bool',
        parameters: [{ name: 'groupID', type: 'unsigned' }],
        description: 'Removes a WinCC OA group.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/removeGroupPVSS.html'
    }],
    ['removeUserFromGroupPVSS', {
        name: 'removeUserFromGroupPVSS',
        returnType: 'bool',
        parameters: [{ name: 'groupID', type: 'unsigned' }, { name: 'userID', type: 'unsigned' }],
        description: 'Removes a WinCC OA group from a user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/removeUserFromGroupPVSS.html'
    }],
    ['removeShape', {
        name: 'removeShape',
        returnType: 'int',
        parameters: [{ name: 'shapePointer', type: 'shape' }],
        description: 'The function removes a shape from the panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/removeShape.html'
    }],
    ['removeSymbol', {
        name: 'removeSymbol',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'shape panel | (string' }, { name: 'panelName', type: 'string' }],
        description: 'The function is used to delete panel references.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/removeSymbol.html'
    }],
    ['removeUserPVSS', {
        name: 'removeUserPVSS',
        returnType: 'bool',
        parameters: [{ name: 'userID', type: 'unsigned' }],
        description: 'The function permanently disables a user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/removeUserPVSS.html'
    }],
    ['rename', {
        name: 'rename',
        returnType: 'void',
        parameters: [],
        description: 'The function renames a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/rename.html'
    }],
    ['requestFileList', {
        name: 'requestFileList',
        returnType: 'dyn_mapping',
        parameters: [{ name: 'manId', type: 'int' }, { name: 'dirs[', type: 'string|dyn_string' }, { name: 'options', type: 'mapping|dyn_mapping' }],
        description: 'The function requestFileList() requests a file list from the manager with the specified manager Id.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/requestFileList.html'
    }],
    ['requestFileTransfer', {
        name: 'requestFileTransfer',
        returnType: 'int',
        parameters: [{ name: 'manId', type: 'int' }, { name: 'fileList', type: 'dyn_string' }],
        description: 'The function requestFileTransfer() requests a list of files to be transferred from the active to passive partner in a redundant project.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/requestFileTransfer.html'
    }],
    ['restorePanel', {
        name: 'restorePanel',
        returnType: 'bool',
        parameters: [{ name: 'panelName[', type: 'string' }, { name: 'moduleName]', type: 'string' }],
        description: 'Opens an already loaded child panel that had been minimized.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/restorePanel.html'
    }],
    ['rewind', {
        name: 'rewind',
        returnType: 'long',
        parameters: [{ name: 'FileDesc', type: 'file' }],
        description: 'Places the pointer at the beginning of the file FileDesc.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/rewind.html'
    }],
    ['rootPanel', {
        name: 'rootPanel',
        returnType: 'string',
        parameters: [{ name: 'modulename', type: 'string', optional: true }],
        description: 'Returns the name of a particular root panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/rootPanel.html'
    }],
    ['RootPanelOn', {
        name: 'RootPanelOn',
        returnType: 'void',
        parameters: [],
        description: 'Opens a new panel in the current module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/RootPanelOn.html'
    }],
    ['RootPanelOnModule', {
        name: 'RootPanelOnModule',
        returnType: 'void',
        parameters: [],
        description: 'Opens a panel in a particular module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/RootPanelOnModule.html'
    }],
    ['RSAGenerateKeyPair', {
        name: 'RSAGenerateKeyPair',
        returnType: 'int',
        parameters: [{ name: 'publicPEM', type: 'string', byRef: true }, { name: 'privatePEM[', type: 'string', byRef: true }, { name: 'bits', type: 'int' }],
        description: 'The function RSAGenerateKeyPair() generates a public and a private key for the functions RSASealEnvelope() and RSAOpenEnvelope().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/RSAGenerateKeyPair.html'
    }],
    ['RSAOpenEnvelope', {
        name: 'RSAOpenEnvelope',
        returnType: 'int',
        parameters: [{ name: 'keyAddress', type: 'string' }, { name: 'encryptedData', type: 'blob' }, { name: 'outputData', type: 'blob', byRef: true }],
        description: 'The function RSAOpenEnvelope() decrypts data.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/RSAOpenEnvelope.html'
    }],
    ['RSASealEnvelope', {
        name: 'RSASealEnvelope',
        returnType: 'int',
        parameters: [{ name: 'keyAddress', type: 'string' }, { name: 'inputData', type: 'blob' }, { name: 'encryptedData', type: 'blob', byRef: true }],
        description: 'The function RSASealEnvelope() encrypts data.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/RSASealEnvelope.html'
    }],
    ['runRealSQL', {
        name: 'runRealSQL',
        returnType: 'int',
        parameters: [{ name: 'sqlCommand', type: 'string' }],
        description: 'The function runRealSQL executes an SQL command that does not return a value such as INSERT or DELETE.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/runRealSQL.html'
    }],
    ['runRealSQLQuery', {
        name: 'runRealSQLQuery',
        returnType: 'int',
        parameters: [{ name: 'sqlQuery', type: 'string' }, { name: 'result', type: 'dyn_dyn_anytype' }],
        description: 'The function runRealSQLQuery executes an SQL query of the RDB database.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/runRealSQLQuery.html'
    }],
    ['rmdir', {
        name: 'rmdir',
        returnType: 'bool',
        parameters: [{ name: 'dir[', type: 'string' }, { name: 'recursive', type: 'bool' }],
        description: 'The function deletes a specified directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlE_R/rmdir.html'
    }],
    ['scanTimeUTC', {
        name: 'scanTimeUTC',
        returnType: 'time',
        parameters: [{ name: 'timeStr', type: 'string' }],
        description: 'Determines the local time from a UTC time string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/scanTimeUTC.html'
    }],
    ['scriptEditor', {
        name: 'scriptEditor',
        returnType: 'int',
        parameters: [{ name: 'scriptstr', type: 'string', byRef: true }, { name: 'filestr]', type: 'string' }],
        description: 'Starts the Script Editor and writes the entered script to a variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/scriptEditor.html'
    }],
    ['scriptInfo', {
        name: 'scriptInfo',
        returnType: 'mapping',
        parameters: [{ name: 'source', type: 'string' }],
        description: 'Returns information for the given source code.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/scriptInfo.html'
    }],
    ['seAddCompletionItem', {
        name: 'seAddCompletionItem',
        returnType: 'int',
        parameters: [{ name: 'displayText', type: 'string' }, { name: 'insertText', type: 'string' }, { name: 'icon', type: 'string' }],
        description: 'Allows to add new auto-complete suggestions for the script editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seAddCompletionItem.html'
    }],
    ['second', {
        name: 'second',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the seconds part (0... 59) of a time t.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/second.html'
    }],
    ['secureRandom', {
        name: 'secureRandom',
        returnType: 'int',
        parameters: [{ name: 'max', type: 'unsigned', optional: true }],
        description: 'Calculates a sequence of secure integer pseudo random numbers.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/secureRandom.html'
    }],
    ['securityEvent', {
        name: 'securityEvent',
        returnType: 'int',
        parameters: [{ name: 'err', type: 'errClass' }, { name: 'needsLog', type: 'bool' }],
        description: 'Function to generate a Security Event.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/securityEvent.html'
    }],
    ['seGetCompletionItem', {
        name: 'seGetCompletionItem',
        returnType: 'dyn_mapping',
        parameters: [],
        description: 'The function returns a list of all user-defined completion items.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seGetCompletionItems.html'
    }],
    ['seGetCursorPos', {
        name: 'seGetCursorPos',
        returnType: 'int',
        parameters: [{ name: 'line', type: 'int', byRef: true }, { name: 'column', type: 'int', byRef: true }],
        description: 'Returns the current cursor position in the script editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seGetCursorPos.html'
    }],
    ['seGetLine', {
        name: 'seGetLine',
        returnType: 'string',
        parameters: [{ name: 'line', type: 'int' }],
        description: 'Returns the code text from a specific line number in the script editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seGetLine.html'
    }],
    ['seGetScriptFileName', {
        name: 'seGetScriptFileName',
        returnType: 'string',
        parameters: [],
        description: 'Returns the name of the file in which the script is located.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seGetScriptFileName.html'
    }],
    ['seGetSelectedText', {
        name: 'seGetSelectedText',
        returnType: 'string',
        parameters: [],
        description: 'Fetches the text selected in the script editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seGetSelectedText.html'
    }],
    ['seGetSelectedTextPos', {
        name: 'seGetSelectedTextPos',
        returnType: 'int',
        parameters: [{ name: 'startLine', type: 'int', byRef: true }, { name: 'startColumn', type: 'int', byRef: true }, { name: 'endColumn', type: 'int', byRef: true }, { name: 'endColumn', type: 'int', byRef: true }],
        description: 'Returns the selected text coordinates in the script editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seGetSelectedTextPos.html'
    }],
    ['seInsertLine', {
        name: 'seInsertLine',
        returnType: 'int',
        parameters: [{ name: 'line', type: 'int' }, { name: 'text', type: 'string' }],
        description: 'Inserts a new line with the corresponding line number and a specific text into the script editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seInsertLine.html'
    }],
    ['seLoadCoverageReport', {
        name: 'seLoadCoverageReport',
        returnType: 'int',
        parameters: [{ name: 'coverageReportPath', type: 'string' }],
        description: 'The function loads a coverage report (an xml file).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seLoadCoverageReport.html'
    }],
    ['semAcquire', {
        name: 'semAcquire',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'string' }, { name: 'n', type: 'int' }, { name: 'timeout]', type: 'time' }],
        description: 'The function semAcquire() tries to acquire n resources guarded by the semaphore.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/semAcquire.html'
    }],
    ['semAvailable', {
        name: 'semAvailable',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'string' }],
        description: 'The function semAvailable() returns the number of available resources in the given semaphore.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/semAvailable.html'
    }],
    ['semRelease', {
        name: 'semRelease',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'string' }, { name: 'n', type: 'int' }],
        description: 'The function semRelease() increases the number of the available resources in the given semaphore.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/semRelease.html'
    }],
    ['sendKeyClick', {
        name: 'sendKeyClick',
        returnType: 'int',
        parameters: [{ name: 's', type: '[shape' }, { name: 'text', type: '] string' }, { name: 'keyName', type: 'string' }, { name: 'modifiers', type: 'int' }],
        description: 'The function sends a key press and key release to the current input focus.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sendKeyClick.html'
    }],
    ['sendMail', {
        name: 'sendMail',
        returnType: 'void',
        parameters: [{ name: 'smtp_host', type: 'string' }, { name: 'email', type: 'anytype' }, { name: 'ret', type: 'int', byRef: true }, { name: 'smtp_user', type: 'string' }, { name: 'smtp_pass', type: 'string' }, { name: 'useTLS', type: 'bool' }, { name: 'sAttachPath', type: 'string' }, { name: 'verbose', type: 'bool' }],
        description: 'The sendMail() function sends encrypted e-mails using an SMTP server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sendMail.html'
    }],
    ['sendMouseEvent', {
        name: 'sendMouseEvent',
        returnType: 'int',
        parameters: [{ name: 'target', type: 'string|shape' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }, { name: 'button', type: 'int' }, { name: 'modifiers', type: 'int' }],
        description: 'The function sends a mouse event to a target window.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sendMouseEvent.html'
    }],
    ['sendSMS', {
        name: 'sendSMS',
        returnType: 'void',
        parameters: [],
        description: 'The sendSMS() function sends an SMS message to a user-defined phone number. The message can be 128 characters long. The function also handles possible errors. Note that if you want to use the control function, the runtime script sms.ctl has to run in the console.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sendSMS.html'
    }],
    ['sendWheelEvent', {
        name: 'sendWheelEvent',
        returnType: 'int',
        parameters: [{ name: 'target', type: 'string moduleName|shape' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }, { name: 'deltaAngle', type: 'int' }, { name: 'modifiers', type: 'int' }],
        description: 'The function sends a mouse-wheel event to a target window.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sendWheelEvent.html'
    }],
    ['setRcvLevel', {
        name: 'setRcvLevel',
        returnType: 'int',
        parameters: [{ name: 'level', type: 'int' }, { name: 'msgFilter', type: 'string' }, { name: 'manFilter', type: 'string' }],
        description: 'The function sets the receive debug level for messages.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setRcvLevel.html'
    }],
    ['seRemoveLine', {
        name: 'seRemoveLine',
        returnType: 'int',
        parameters: [{ name: 'line', type: 'int' }],
        description: 'Removes a specific code line in the script editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seRemoveLine.html'
    }],
    ['setReportFlags', {
        name: 'setReportFlags',
        returnType: 'int',
        parameters: [{ name: 'flags', type: 'string' }],
        description: 'Triggers the report output with the specified debug flags.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setReportFlags.html'
    }],
    ['setSndLevel', {
        name: 'setSndLevel',
        returnType: 'int',
        parameters: [{ name: 'level', type: 'int' }, { name: 'msgFilter', type: 'string' }, { name: 'manFilter', type: 'string' }],
        description: 'The function sets the send debug level for messages.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setSndLevel.html'
    }],
    ['seSetCursorPos', {
        name: 'seSetCursorPos',
        returnType: 'int',
        parameters: [{ name: 'line', type: 'int' }, { name: 'column[', type: 'int' }, { name: 'select', type: 'bool' }],
        description: 'Sets the cursor on a specific position in the script editor.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seSetCursorPos.html'
    }],
    ['seSetLine', {
        name: 'seSetLine',
        returnType: 'int',
        parameters: [{ name: 'line', type: 'int' }, { name: 'text', type: 'string' }],
        description: 'Inserts a text in a specific line in the script editor. If a text already exists in this line, it will be replaced.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seSetLine.html'
    }],
    ['seSetLines', {
        name: 'seSetLines',
        returnType: 'int',
        parameters: [{ name: 'lines', type: 'dyn_int' }, { name: 'texts', type: 'dyn_string' }],
        description: 'Inserts multiple lines of text in the selected lines in the script editor. The text already in the lines will be replaced.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/seSetLines.html'
    }],
    ['setACount', {
        name: 'setACount',
        returnType: 'int',
        parameters: [{ name: 'AlertTime', type: 'atime', byRef: true }, { name: 'AlertNo', type: 'uint' }],
        description: 'Sets an alarm number in an alarm time variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setACount.html'
    }],
    ['setActiveIconTheme', {
        name: 'setActiveIconTheme',
        returnType: 'void',
        parameters: [],
        description: 'This functions sets an icon theme.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setActiveIconTheme.html'
    }],
    ['setAIdentifier', {
        name: 'setAIdentifier',
        returnType: 'void',
        parameters: [],
        description: 'Sets the name of a datapoint in a time of an alert.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setAIdentifier.html'
    }],
    ['setApplicationProperty', {
        name: 'setApplicationProperty',
        returnType: 'int',
        parameters: [{ name: 'property', type: 'string' }, { name: 'value', type: '<type>' }],
        description: 'Allows to edit application properties.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setApplicationProperty.html'
    }],
    ['setBit', {
        name: 'setBit',
        returnType: 'int',
        parameters: [{ name: 'aBitVar', type: 'bit32', byRef: true }, { name: 'position', type: 'int' }, { name: 'value', type: 'bool' }],
        description: 'Sets a bit within a bit32/bit64 variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setBit.html'
    }],
    ['setClipboardText', {
        name: 'setClipboardText',
        returnType: 'int',
        parameters: [{ name: 'text', type: 'string' }],
        description: 'Copies a specific text to the clipboard as plain text.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setClipboardText.html'
    }],
    ['setClutteringLimits', {
        name: 'setClutteringLimits',
        returnType: 'int',
        parameters: [{ name: 'lowerLimits', type: 'dyn_int' }, { name: 'upperLimits', type: 'dyn_int' }, { name: 'moduleName', type: '[string' }, { name: 'panelName]', type: 'string', optional: true }],
        description: 'This function is used for defining the zoom factor to show/hide layers (cluttering/decluttering) in individual panels.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setClutteringLimits.html'
    }],
    ['setCursorPosition', {
        name: 'setCursorPosition',
        returnType: 'int',
        parameters: [{ name: 'x', type: 'int' }, { name: '[', type: 'int y' }, { name: 'globalPos', type: 'bool' }],
        description: 'Sets the cursor position to a specific coordinate.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setCursorPosition.html'
    }],
    ['setDbgFlag', {
        name: 'setDbgFlag',
        returnType: 'int',
        parameters: [{ name: 'flag', type: 'string name|int' }, { name: 'on', type: 'bool' }],
        description: 'The function allows to set debug flags inside of a CTRL script.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setDbgFlag.html'
    }],
    ['setDollarParams', {
        name: 'setDollarParams',
        returnType: 'int',
        parameters: [{ name: 'refName', type: 'string' }, { name: 'values', type: 'dyn_string dollars dyn_string' }],
        description: 'This CTRL function is used to set the dollar parameters of the graphics reference. Only in the panel for reference configuration in the GEDI!',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setDollarParams.html'
    }],
    ['setenv', {
        name: 'setenv',
        returnType: 'void',
        parameters: [],
        description: 'Sets the value of an environment variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setenv.html'
    }],
    ['setFileModificationTime', {
        name: 'setFileModificationTime',
        returnType: 'int',
        parameters: [{ name: 'PathFilename', type: 'string' }, { name: 'mtime', type: 'time' }],
        description: 'This function sets/changes the last modification date and time of a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setFileModificationTime.html'
    }],
    ['setFilePermissions', {
        name: 'setFilePermissions',
        returnType: 'int',
        parameters: [{ name: 'filename', type: 'string' }, { name: 'permissions', type: 'int' }],
        description: 'Sets the permissions for a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setFilePermissions.html'
    }],
    ['setGroupNamePVSS', {
        name: 'setGroupNamePVSS',
        returnType: 'bool',
        parameters: [{ name: 'pvssGroupID', type: 'unsigned' }, { name: 'groupName', type: 'string' }, { name: 'groupFullName', type: 'langString' }, { name: 'groupComment', type: 'langString' }],
        description: 'Use the function UserManagementBaseType:: setFullName() instead!',
        deprecated: true,
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setGroupNamePVSS.html'
    }],
    ['setInputFocus', {
        name: 'setInputFocus',
        returnType: 'int',
        parameters: [{ name: 'object', type: 'string|shape' }],
        description: 'Sets the input focus.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setInputFocus.html'
    }],
    ['setLangString', {
        name: 'setLangString',
        returnType: 'int',
        parameters: [{ name: 'aLangString', type: 'langString', byRef: true }, { name: 'index', type: 'int' }, { name: 'aText', type: 'string' }],
        description: 'Sets an entry of a langString to a string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setLangString.html'
    }],
    ['setMultiValue', {
        name: 'setMultiValue',
        returnType: 'int',
        parameters: [{ name: 'shapeA', type: 'string' }, { name: 'attributeA_1', type: 'string' }, { name: '...', type: '<typeA_1_1> parA_1_1', optional: true }, { name: 'shapeB', type: 'string' }, { name: 'attributeB_1', type: 'string' }, { name: 'parB_1_1]]', type: '<typeB_1_1>' }],
        description: 'Sets any number of graphics attributes of any number of graphics elements.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setMultiValue.html'
    }],
    ['setPanelSize', {
        name: 'setPanelSize',
        returnType: 'int',
        parameters: [{ name: 'module', type: 'string' }, { name: 'panel', type: 'string' }, { name: 'fitToBounding', type: 'bool' }, { name: 'width', type: 'int' }, { name: 'height', type: 'int' }],
        description: 'Sets a child panel or a module (panel as a module) to a defined size.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setPanelSize.html'
    }],
    ['setPattern', {
        name: 'setPattern',
        returnType: 'int',
        parameters: [{ name: 'aBitVar', type: 'bit32', byRef: true }, { name: 'pattern', type: 'string' }],
        description: 'Sets a bit32/bit64 variable to a binary pattern.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setPattern.html'
    }],
    ['setPeriod', {
        name: 'setPeriod',
        returnType: 'time',
        parameters: [{ name: 't', type: 'time', byRef: true }, { name: '[', type: 'unsigned seconds' }, { name: 'milli]', type: 'unsigned' }],
        description: 'Sets t to a particular number of seconds and milliseconds.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setPeriod.html'
    }],
    ['setQueryRDBDirect', {
        name: 'setQueryRDBDirect',
        returnType: 'int',
        parameters: [{ name: 'on', type: 'bool' }],
        description: 'Allows to change the queryRDBdirect settings to change between querying directly from the RDB or querying via the data manager during runtime.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setQueryRDBDirect.html'
    }],
    ['setScaleStyle', {
        name: 'setScaleStyle',
        returnType: 'int',
        parameters: [{ name: '[', type: 'int style' }, { name: 'moduleName]', type: 'string' }],
        description: 'Sets the scale style of the module for zooming.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setScaleStyle.html'
    }],
    ['setScript', {
        name: 'setScript',
        returnType: 'int',
        parameters: [{ name: 'scriptstr', type: 'string' }],
        description: 'Sets a control script to a graphical attribute.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setScript.html'
    }],
    ['setScriptLangId', {
        name: 'setScriptLangId',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'int' }],
        description: 'Sets the current language of the script to the specified value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setScriptLangId.html'
    }],
    ['setScriptUserId', {
        name: 'setScriptUserId',
        returnType: 'int',
        parameters: [{ name: 'uid', type: 'unsigned' }],
        description: 'Sets the current user ID of the script to the specified value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setScriptUserId.html'
    }],
    ['setThrowErrorAsException', {
        name: 'setThrowErrorAsException',
        returnType: 'int',
        parameters: [{ name: 'on', type: 'bool' }],
        description: 'Allows to change the behavior for error handling within the current thread.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setThrowErrorAsException.html'
    }],
    ['setTime', {
        name: 'setTime',
        returnType: 'time',
        parameters: [{ name: 't', type: 'time', byRef: true }, { name: 'year', type: 'unsigned' }, { name: 'month', type: 'unsigned' }, { name: '[', type: 'unsigned day' }, { name: '[', type: 'unsigned hour' }, { name: '[', type: 'unsigned minute' }, { name: '[', type: 'unsigned second' }, { name: '[', type: 'unsigned milli' }, { name: 'daylightsaving]]]]]', type: 'bool' }],
        description: 'Sets a time to the value specified in the argument.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setTime.html'
    }],
    ['setTrace', {
        name: 'setTrace',
        returnType: 'int',
        parameters: [{ name: 'traceLevel', type: 'int' }],
        description: 'Changes the trace level of the current thread.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setTrace.html'
    }],
    ['setUserEnabledPVSS', {
        name: 'setUserEnabledPVSS',
        returnType: 'bool',
        parameters: [{ name: 'pvssUserID', type: 'unsigned' }, { name: 'userState', type: 'bool' }],
        description: 'Enables the user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setUserEnabledPVSS.html'
    }],
    ['setUserId', {
        name: 'setUserId',
        returnType: 'bool',
        parameters: [{ name: '[', type: 'unsigned id' }, { name: 'password]', type: 'string' }],
        description: 'Sets the current user ID to the specified value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setUserId.html'
    }],
    ['setUserNamePVSS', {
        name: 'setUserNamePVSS',
        returnType: 'bool',
        parameters: [{ name: 'pvssUserID', type: 'unsigned' }, { name: 'userName', type: 'string' }, { name: 'userFullName', type: 'langString' }, { name: 'userComment', type: 'langString' }],
        description: 'Use the function UserManagementBaseType:: setFullName() instead!',
        deprecated: true,
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setUserNamePVSS.html'
    }],
    ['setUserNameSSO', {
        name: 'setUserNameSSO',
        returnType: 'bool',
        parameters: [{ name: 'username', type: 'string' }],
        description: 'Sets the name of a WinCC OA user for SSO.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setUserNameSSO.html'
    }],
    ['setUserOsIdPVSS', {
        name: 'setUserOsIdPVSS',
        returnType: 'bool',
        parameters: [{ name: 'pvssUserID', type: 'unsigned' }, { name: 'osID', type: 'string' }],
        description: 'Sets the OS ID for the user with the given WinCC OA user ID.',
        deprecated: true,
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setUserOsIdPVSS.html'
    }],
    ['setValue', {
        name: 'setValue',
        returnType: 'int',
        parameters: [{ name: 'shape', type: 'string' }, { name: 'attribute1', type: 'string' }, { name: '[', type: '<type1_1> par1_1' }, { name: 'par1_2...', type: '<type1_2>', optional: true }, { name: 'attribute2', type: 'string' }, { name: '[', type: '<type2_1> par2_1' }, { name: 'par2_2...]]', type: '<type2_2>' }],
        description: 'The function setValue() sets any number of graphics attributes of a graphics object.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setValue.html'
    }],
    ['setVariable', {
        name: 'setVariable',
        returnType: 'void',
        parameters: [{ name: 'which', type: 'string' }, { name: 'value', type: 'anytype' }],
        description: 'The function allows to set the value of the stated variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setVariable.html'
    }],
    ['setWindowIcon', {
        name: 'setWindowIcon',
        returnType: 'void',
        parameters: [],
        description: 'Sets the header of a module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setWindowIcon.html'
    }],
    ['setWindowTitle', {
        name: 'setWindowTitle',
        returnType: 'void',
        parameters: [],
        description: 'Sets the header of a module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setWindowTitle.html'
    }],
    ['setZoomRange', {
        name: 'setZoomRange',
        returnType: 'int',
        parameters: [{ name: 'min', type: 'float' }, { name: 'max', type: 'float' }],
        description: 'Sets the minimum and maximum value that can be used while zooming.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/setZoomRange.html'
    }],
    ['shapeExists', {
        name: 'shapeExists',
        returnType: 'bool',
        parameters: [{ name: 'graphicsName', type: 'string' }],
        description: 'The function returns whether a graphics element exists in the panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/shapeExists.html'
    }],
    ['showProgressBar', {
        name: 'showProgressBar',
        returnType: 'void',
        parameters: [{ name: 'text1', type: 'string' }, { name: 'text2', type: 'string' }, { name: 'text3', type: 'string' }, { name: 'percent', type: 'float' }],
        description: 'The function updates the status bar of a process.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/showProgressBar.html'
    }],
    ['sin', {
        name: 'sin',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Calculates the sine.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sin.html'
    }],
    ['sinh', {
        name: 'sinh',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Calculates the hyperbolic sine.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sinh.html'
    }],
    ['snmpcrypt_encryptAccessParameter', {
        name: 'snmpcrypt_encryptAccessParameter',
        returnType: 'int',
        parameters: [{ name: 'drvNum', type: 'int' }, { name: 'accessParam', type: 'string' }],
        description: 'The function allows to encrypt SNMP access parameters with the defined password of the corresponding driver ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/snmpcrypt_encryptAccessParameter.html'
    }],
    ['snmpcrypt_setAccessPassPhrase', {
        name: 'snmpcrypt_setAccessPassPhrase',
        returnType: 'int',
        parameters: [{ name: 'drvNum', type: 'int' }, { name: 'appOld', type: 'string' }, { name: 'app', type: 'string' }],
        description: 'The function allows to set a password for the encryption of SNMP access parameters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/snmpcrypt_setAccessPassPhrase.html'
    }],
    ['snmpMIBBrowserGetAdditionalInfos', {
        name: 'snmpMIBBrowserGetAdditionalInfos',
        returnType: 'int',
        parameters: [{ name: 'mib_filename', type: 'string' }, { name: 'oids', type: 'dyn_string' }, { name: 'addInfos', type: 'dyn_mapping', byRef: true }],
        description: 'Returns the additional information for the specified OIDs of a MIB file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/snmpMIBBrowserGetAdditionalInfos.html'
    }],
    ['snmpMIBBrowserGetHierarchyNames', {
        name: 'snmpMIBBrowserGetHierarchyNames',
        returnType: 'int',
        parameters: [{ name: 'mib_filename', type: 'string' }, { name: 'entry_point_oid', type: 'string' }, { name: 'item_names', type: 'dyn_string', byRef: true }, { name: 'item_oids[', type: 'dyn_string', byRef: true }, { name: 'deep_search', type: 'bool' }],
        description: 'Returns subordinated OIDs and item names of a passed start OID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/snmpMIBBrowserGetHierarchyNames.html'
    }],
    ['sprintf', {
        name: 'sprintf',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string', byRef: true }, { name: '[', type: 'string format' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Formats a string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sprintf.html'
    }],
    ['sprintfPL', {
        name: 'sprintfPL',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }, { name: '[', type: 'string format' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Formats a string. Like sprintf(), but change to the current WinCC OA language before converting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sprintfPL.html'
    }],
    ['sprintfUL', {
        name: 'sprintfUL',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }, { name: '[', type: 'string format' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'The function formats a string like sprintf() but changes to the current user language before formatting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sprintfUL.html'
    }],
    ['sqrt', {
        name: 'sqrt',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Calculates the square root.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sqrt.html'
    }],
    ['srand', {
        name: 'srand',
        returnType: 'void',
        parameters: [{ name: 'seed', type: 'int', optional: true }],
        description: 'Defines the initial value for the function rand().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/srand.html'
    }],
    ['sscanf', {
        name: 'sscanf',
        returnType: 'void',
        parameters: [],
        description: 'Reads data from "s" and stores the data according to the "format" parameter into the additional arguments.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sscanf.html'
    }],
    ['sscanfPL', {
        name: 'sscanfPL',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }, { name: 'format', type: 'string' }, { name: 'var1', type: '<type1>', byRef: true }, { name: 'var2...]', type: '<type2>', byRef: true }],
        description: 'Imports a string in formatted form. Like sscanf(), but changes to the current WinCC OA language before converting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sscanfPL.html'
    }],
    ['sscanfUL', {
        name: 'sscanfUL',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }, { name: 'format', type: 'string' }, { name: 'var1', type: '<type1>', byRef: true }, { name: 'var2...]', type: '<type2>', byRef: true }],
        description: 'The function imports a string in formatted form. The function works like the function sscanf() but changes to the current user language before reading the string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sscanfUL.html'
    }],
    ['startAnimation', {
        name: 'startAnimation',
        returnType: 'int',
        parameters: [{ name: '[', type: 'int id' }, { name: 'deletionPolicy', type: 'string', optional: true }, { name: 'options]', type: 'mapping' }],
        description: 'The function startAnimation() starts an animation group.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/startAnimation.html'
    }],
    ['startAnimationWait', {
        name: 'startAnimationWait',
        returnType: 'int',
        parameters: [{ name: '[', type: 'int id' }, { name: 'deletionPolicy', type: 'string', optional: true }, { name: 'options]', type: 'mapping' }],
        description: 'The function startAnimationWait() starts an animation group but unlike the function startAnimation() waits for the animation to finish.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/startAnimationWait.html'
    }],
    ['startScript', {
        name: 'startScript',
        returnType: 'int',
        parameters: [{ name: '[', type: 'string|int script' }, { name: '[', type: 'dyn_string dollars' }, { name: 'func', type: 'string' }, { name: 'args]]', type: 'dyn_anytype', optional: true }],
        description: 'The startScript function starts a script, which is independent from the script from where it was started.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/startScript.html'
    }],
    ['startPanelRefConstruct', {
        name: 'startPanelRefConstruct',
        returnType: 'int',
        parameters: [{ name: 'panelFileName', type: 'string' }, { name: 'dp', type: 'string' }],
        description: 'Starts the construction of the panel reference in the current panel in the GEDI.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/startPanelRefConstruct.html'
    }],
    ['startSound', {
        name: 'startSound',
        returnType: 'bool',
        parameters: [{ name: '[', type: 'string wavFileName' }, { name: 'loopSound', type: 'bool' }],
        description: 'Plays a WAV file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/startSound.html'
    }],
    ['startSymbol', {
        name: 'startSymbol',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'shape panel | (string' }, { name: 'panelName', type: 'string' }],
        description: 'Starts a panel reference in a panel after creating a reference via createSymbol(). The function is identical to the function addSymbol() but does not execute the initialize script.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/startSymbol.html'
    }],
    ['startThread', {
        name: 'startThread',
        returnType: 'int',
        parameters: [{ name: '[', type: 'string|function_ptr func' }, { name: 'arg1...]', type: 'anytype' }],
        description: 'Starts a function in a new thread.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/startThread.html'
    }],
    ['stayOnTop', {
        name: 'stayOnTop',
        returnType: 'int',
        parameters: [{ name: '[', type: 'bool bFlag' }, { name: 'module]', type: 'string' }],
        description: 'The function places the specified module above all non-topmost windows. The window of the module maintains its topmost position even when it is deactivated.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/stayOnTop.html'
    }],
    ['std_help', {
        name: 'std_help',
        returnType: 'void',
        parameters: [{ name: 'keyword[', type: 'string' }, { name: 'showChild', type: 'bool' }, { name: 'docNamespace', type: 'string' }, { name: 'docPackage', type: 'string' }, { name: 'useLangFilter', type: 'bool' }],
        description: 'The function displays any page of the Online Help, an arbitrary HTML page in the browser or an arbitrary text/pdf file on the computer resp. on a computer in the network.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/std_help.html'
    }],
    ['stop', {
        name: 'stop',
        returnType: 'void',
        parameters: [],
        description: 'Stops the playback.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/stop.html'
    }],
    ['stopAnimation', {
        name: 'stopAnimation',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'int' }],
        description: 'This function stops an animation.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/stopAnimation.html'
    }],
    ['stopScript', {
        name: 'stopScript',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'int' }],
        description: 'Stops a function by the stated ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/stopScript.html'
    }],
    ['stopSound', {
        name: 'stopSound',
        returnType: 'bool',
        parameters: [],
        description: 'Stops the playback of a WAV file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/stopSound.html'
    }],
    ['stopThread', {
        name: 'stopThread',
        returnType: 'int',
        parameters: [{ name: 'threadId', type: 'int' }, { name: 'log', type: 'bool' }],
        description: 'Stops a thread.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/stopThread.html'
    }],
    ['strchange', {
        name: 'strchange',
        returnType: 'int',
        parameters: [{ name: 'source', type: 'string', byRef: true }],
        description: 'Changes the content of a string at a specific index for a defined count of digits with a replacing string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strchange.html'
    }],
    ['strexpand', {
        name: 'strexpand',
        returnType: 'string',
        parameters: [{ name: 's', type: 'string' }, { name: 'length', type: 'unsigned' }],
        description: 'Returns a formatted string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strexpand.html'
    }],
    ['strformat', {
        name: 'strformat',
        returnType: 'string',
        parameters: [{ name: 'format', type: 'string' }, { name: 'len', type: 'int' }, { name: 'value', type: 'anytype' }],
        description: 'Returns a formatted string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strformat.html'
    }],
    ['strjoin', {
        name: 'strjoin',
        returnType: 'string',
        parameters: [{ name: 'lines', type: 'dyn_anytype' }, { name: 'delim', type: 'string/char' }],
        description: 'This function is used to combine elements of a dyn_string to one string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strjoin.html'
    }],
    ['strlen', {
        name: 'strlen',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }],
        description: 'Returns the length of a string in Bytes.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strlen.html'
    }],
    ['strltrim', {
        name: 'strltrim',
        returnType: 'string',
        parameters: [{ name: '[', type: 'string s' }, { name: 'trimstr]', type: 'string' }],
        description: 'Removes certain characters from a string, beginning from left.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strltrim.html'
    }],
    ['strpos', {
        name: 'strpos',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }, { name: 'searchstr[', type: 'string' }, { name: 'startPos', type: 'int' }],
        description: 'Returns the position of a string within another.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strpos.html'
    }],
    ['strreplace', {
        name: 'strreplace',
        returnType: 'int',
        parameters: [{ name: 'source', type: 'string', byRef: true }, { name: 'search', type: 'string' }, { name: 'replace', type: 'string' }],
        description: 'Replaces parts of a string with another string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strreplace.html'
    }],
    ['strrtrim', {
        name: 'strrtrim',
        returnType: 'string',
        parameters: [{ name: '[', type: 'string s' }, { name: 'trimstr]', type: 'string' }],
        description: 'Cuts certain characters out of a string, starting from the right.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strrtrim.html'
    }],
    ['strsplit', {
        name: 'strsplit',
        returnType: 'dyn_string',
        parameters: [{ name: 'line', type: 'string' }, { name: 'delim', type: 'string/char' }],
        description: 'Splits strings using delimiters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strsplit.html'
    }],
    ['strtok', {
        name: 'strtok',
        returnType: 'int',
        parameters: [{ name: '[', type: 'string s' }, { name: 'set]', type: 'string' }],
        description: 'Searches a string for the first occurrence of any of a set of bytes.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strtok.html'
    }],
    ['strtolower', {
        name: 'strtolower',
        returnType: 'string',
        parameters: [{ name: 'text', type: 'string' }],
        description: 'Changes a string to lowercase.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strtolower.html'
    }],
    ['strtoupper', {
        name: 'strtoupper',
        returnType: 'string',
        parameters: [{ name: 'text', type: 'string' }],
        description: 'Changes a string to uppercase.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strtoupper.html'
    }],
    ['strwalk', {
        name: 'strwalk',
        returnType: 'string',
        parameters: [{ name: 's', type: 'string' }, { name: 'pos', type: 'int', byRef: true }],
        description: 'The function allows to move through a string and returns the corresponding character of a specific position.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/strwalk.html'
    }],
    ['substr', {
        name: 'substr',
        returnType: 'string',
        parameters: [{ name: 's', type: 'string' }, { name: '[', type: 'int pos' }, { name: 'len]', type: 'int' }],
        description: 'Cuts a string or a character of a certain length (in Bytes) out of another string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/substr.html'
    }],
    ['switchCtrlConnectionsToReplica', {
        name: 'switchCtrlConnectionsToReplica',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }],
        description: 'Switches Ctrl in split mode.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/switchCtrlConnectionsToReplica.html'
    }],
    ['switchCtrlConnectionToReplica', {
        name: 'switchCtrlConnectionToReplica',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }, { name: 'ctrlNum', type: 'int' }],
        description: 'Switches the CTRL with a specific number over.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/switchCtrlConnectionToReplica.html'
    }],
    ['switchLang', {
        name: 'switchLang',
        returnType: 'int',
        parameters: [{ name: 'lang', type: 'int langIdx | OaLanguage lang | string' }],
        description: 'Function for switching the language at runtime in a user interface.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/switchLang.html'
    }],
    ['SwitchLayer', {
        name: 'SwitchLayer',
        returnType: 'void',
        parameters: [],
        description: 'Switches the visibility of two layers.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/SwitchLayer.html'
    }],
    ['SwitchLayerPanel', {
        name: 'SwitchLayerPanel',
        returnType: 'void',
        parameters: [],
        description: 'Switches the visibility of two layers in a specific panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/SwitchLayerPanel.html'
    }],
    ['SwitchLayerPanelInModule', {
        name: 'SwitchLayerPanelInModule',
        returnType: 'void',
        parameters: [],
        description: 'Switches the visibility of two layers in a specific panel and module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/switchLayerPanelInModule.html'
    }],
    ['switchUiConnectionsToReplica', {
        name: 'switchUiConnectionsToReplica',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }],
        description: 'Switches the UI in the split mode.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/switchUiConnectionsToReplica.html'
    }],
    ['switchUiConnectionToReplica', {
        name: 'switchUiConnectionToReplica',
        returnType: 'int',
        parameters: [{ name: 'sSystem', type: 'string' }, { name: 'peerNr', type: 'int' }, { name: 'uiNum', type: 'int' }],
        description: 'Switches a UI with a specific number in the split mode.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/switchUiConnectionToReplica.html'
    }],
    ['sysConnect', {
        name: 'sysConnect',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'event]', type: 'string' }],
        description: 'The function allows to connect to specific system events.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sysConnect.html'
    }],
    ['sysConnectUserData', {
        name: 'sysConnectUserData',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'userData', type: '<any>' }, { name: 'event]', type: 'string' }],
        description: 'The function allows to connect to specific system events.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sysConnectUserData.html'
    }],
    ['sysDisconnect', {
        name: 'sysDisconnect',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'event]', type: 'string' }],
        description: 'The function allows to disconnect from a specific system events previously connect using sysConnect().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sysDisconnect.html'
    }],
    ['sysDisconnectUserData', {
        name: 'sysDisconnectUserData',
        returnType: 'int',
        parameters: [{ name: 'object', type: '[class' }, { name: 'work', type: '] string|function_ptr' }, { name: 'userData', type: '<any>' }, { name: 'event]', type: 'string' }],
        description: 'The function allows to disconnect from a specific system events previously connect using sysConnectUserData().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/sysDisconnectUserData.html'
    }],
    ['system', {
        name: 'system',
        returnType: 'int',
        parameters: [{ name: '[', type: 'string shellcommand | dyn_string progAndArgs | mapping options' }, { name: 'stdout', type: 'string', byRef: true }, { name: 'stderr]]', type: 'string', byRef: true }],
        description: 'Runs a system shell command.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/system.html'
    }],
    ['systemDetached', {
        name: 'systemDetached',
        returnType: 'bool',
        parameters: [{ name: 'command', type: 'string' }],
        description: 'The function runs a system shell command in the background.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/systemDetached.html'
    }],
    ['tan', {
        name: 'tan',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Calculates the tangent.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tan.html'
    }],
    ['tanh', {
        name: 'tanh',
        returnType: 'float',
        parameters: [{ name: 'x', type: 'float' }],
        description: 'Calculates the hyperbolic tangent.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tanh.html'
    }],
    ['tcpClose', {
        name: 'tcpClose',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }],
        description: 'Closes a TCP/IP socket connection.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tcpClose.html'
    }],
    ['tcpOpen', {
        name: 'tcpOpen',
        returnType: 'int',
        parameters: [{ name: 'host', type: 'string' }, { name: '[', type: 'unsigned port' }, { name: 'timeout]', type: 'time' }],
        description: 'Opens the connection to a TCP/IP server socket.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tcpOpen.html'
    }],
    ['tcpRead', {
        name: 'tcpRead',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }, { name: 'data', type: 'string/blob', byRef: true }, { name: 'maxTimeout', type: 'time' }],
        description: 'Reads the data of a defined socket, which was opened with tcpOpen().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tcpRead.html'
    }],
    ['tcpShutdownOutput', {
        name: 'tcpShutdownOutput',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }],
        description: 'Closes the write direction of a TCP socket.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tcpShutdownOutput.html'
    }],
    ['tcpWrite', {
        name: 'tcpWrite',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }, { name: 'data', type: 'string/blob' }],
        description: 'Writes data to the defined socket.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tcpWrite.html'
    }],
    ['textEditor', {
        name: 'textEditor',
        returnType: 'int',
        parameters: [{ name: 'propName', type: 'string' }, { name: '[', type: 'anytype propValue' }],
        description: 'Opens the text editor as a main window (not modally).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/textEditor.html'
    }],
    ['throw', {
        name: 'throw',
        returnType: 'int',
        parameters: [{ name: 'exception', type: 'errClass|dyn_errClass' }],
        description: 'Signals an erroneous condition by using an error class variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/throw.html'
    }],
    ['throwError', {
        name: 'throwError',
        returnType: 'int',
        parameters: [{ name: 'error', type: 'dyn_errClass' }],
        description: 'Passes a WinCC OA error to the internal error handler.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/throwError.html'
    }],
    ['timeFromGMT', {
        name: 'timeFromGMT',
        returnType: 'int',
        parameters: [],
        description: 'Returns the difference between local time and GMT.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/timeFromGMT.html'
    }],
    ['timedFunc', {
        name: 'timedFunc',
        returnType: 'int',
        parameters: [{ name: 'workFunc', type: 'string' }, { name: 'datapoint', type: 'string' }],
        description: 'Starts timed CTRL functions.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/timedFunc.html'
    }],
    ['timedFuncEvents', {
        name: 'timedFuncEvents',
        returnType: 'void',
        parameters: [],
        description: 'The function timedFuncEvents() returns up to a given max_count all planned start_times (occurrences) when WinCC OA timedFunc would trigger a (start-)event. This function also handles the time periods (broadcast periods) (see Timed function extension ) within the range defined by ’r;valid from’ and ’r;valid until’.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/timedFuncEvents.html'
    }],
    ['timedFuncEventCount', {
        name: 'timedFuncEventCount',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'The timed function was extended and now provides several new functions:',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/Timed_function_extension.html'
    }],
    ['timedFuncEventCount', {
        name: 'timedFuncEventCount',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'The timed function was extended and now provides several new functions:',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/Timed_function_extension.html'
    }],
    ['timedFuncEventCount', {
        name: 'timedFuncEventCount',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'The timed function was extended and now provides several new functions:',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/Timed_function_extension.html'
    }],
    ['timedFuncEventCount', {
        name: 'timedFuncEventCount',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'The timed function was extended and now provides several new functions:',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/Timed_function_extension.html'
    }],
    ['timedFuncEventCount', {
        name: 'timedFuncEventCount',
        returnType: 'int',
        parameters: [{ name: 'dp', type: 'string' }],
        description: 'The timed function was extended and now provides several new functions:',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/Timed_function_extension.html'
    }],
    ['timedFuncConflicts', {
        name: 'timedFuncConflicts',
        returnType: 'int',
        parameters: [{ name: 'dpValue', type: 'mapping' }, { name: 'durValue', type: 'unsigned' }, { name: 'dpValueList', type: 'dyn_mapping' }, { name: 'durValueList', type: 'dyn_uint' }, { name: 'from', type: 'time' }, { name: 'until', type: 'time' }, { name: 'max_count', type: 'unsigned' }, { name: 'result', type: 'dyn_dyn_time' }],
        description: 'The timed function extension "timedFuncConflicts()" is designed to discover call conflicts between two or more timed functions. It compares the given parameters to analyze all conflicts and returns the result times.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/Timed_function_extension_timedFuncConflicts.html'
    }],
    ['titleBar', {
        name: 'titleBar',
        returnType: 'int',
        parameters: [{ name: '[', type: 'bool bFlag' }, { name: 'moduleName', type: 'string' }, { name: 'panelName]', type: 'string' }],
        description: 'Shows or hides the title bar in the specified module or in a child panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/titleBar.html'
    }],
    ['tmpdir', {
        name: 'tmpdir',
        returnType: 'string',
        parameters: [],
        description: 'Creates a temporary directory',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tmpdir.html'
    }],
    ['tmpnam', {
        name: 'tmpnam',
        returnType: 'string',
        parameters: [],
        description: 'Creates temporary file names.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tmpnam.html'
    }],
    ['tr', {
        name: 'tr',
        returnType: 'string',
        parameters: [{ name: 'sourceTerm', type: 'string' }, { name: 'comment', type: 'string' }, { name: 'lang]', type: 'int|string|OaLanguage' }],
        description: 'The function translates the given combination (text, comment) into the requested language or the UI language if the lang argument is not given.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/tr.html'
    }],
    ['trackZoomMode', {
        name: 'trackZoomMode',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string', optional: true }],
        description: 'Complies with the function "Rubber band zoom". After calling this function a cursor "cross" is displayed, which allows to create a window by left-clicking. The panel is scaled in accordance with the specified window size.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/trackZoomMode.html'
    }],
    ['translate', {
        name: 'translate',
        returnType: 'int',
        parameters: [{ name: 'inMeta', type: 'string' }, { name: 'inTarget', type: 'string', byRef: true }, { name: 'lang', type: 'int langIdx|OaLanguage' }],
        description: 'Translates a term.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/translate.html'
    }],
    ['triggerAction', {
        name: 'triggerAction',
        returnType: 'int',
        parameters: [{ name: '[', type: 'string actionName' }, { name: 'moduleName]', type: 'string' }],
        description: 'The function can be used to trigger an action from a GEDI or Script Editor extension script.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/triggerAction.html'
    }],
    ['triggerEvent', {
        name: 'triggerEvent',
        returnType: 'int',
        parameters: [{ name: 'event', type: 'string|function_ptr' }],
        description: 'The function triggers a specific event.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/triggerEvent.html'
    }],
    ['triggerEventWait', {
        name: 'triggerEventWait',
        returnType: 'int',
        parameters: [{ name: 'event', type: 'string|function_ptr' }],
        description: 'The function triggers a specific event and waits for the execution of the event.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/triggerEventWait.html'
    }],
    ['triggerGlobalEvent', {
        name: 'triggerGlobalEvent',
        returnType: 'int',
        parameters: [{ name: 'event', type: 'string' }],
        description: 'The function triggers a UI global event.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/triggerGlobalEvent.html'
    }],
    ['udpClose', {
        name: 'udpClose',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }],
        description: 'Closes the connection to a UDP socket.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/udpClose.html'
    }],
    ['udpOpen', {
        name: 'udpOpen',
        returnType: 'int',
        parameters: [{ name: 'host', type: 'string' }, { name: '[', type: 'unsigned port' }, { name: 'timeout]', type: 'time' }],
        description: 'Opens a connection to a UDP socket.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/udpOpen.html'
    }],
    ['udpRead', {
        name: 'udpRead',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }, { name: 'data', type: 'string/blob', byRef: true }, { name: 'host', type: 'string', byRef: true }, { name: 'port', type: 'unsigned', byRef: true }, { name: 'maxTimeout', type: 'time' }],
        description: 'Reads the data from a UDP socket.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/udpRead.html'
    }],
    ['udpWrite', {
        name: 'udpWrite',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }, { name: 'data', type: 'string/blob' }, { name: 'host', type: 'string' }, { name: 'port', type: 'unsigned' }],
        description: 'Writes data to the passed UDP socket (host).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/udpWrite.html'
    }],
    ['uniDynPatternMatch', {
        name: 'uniDynPatternMatch',
        returnType: 'dyn_string',
        parameters: [{ name: 'pattern', type: 'string' }, { name: 'ds', type: 'dyn_string' }],
        description: 'Checks whether particular strings in a dynamic field have a specific pattern.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniDynPatternMatch.html'
    }],
    ['uniFPrintf', {
        name: 'uniFPrintf',
        returnType: 'int',
        parameters: [{ name: 'file', type: 'file' }, { name: 'format', type: 'string' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Writes to a file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniFPrintf.html'
    }],
    ['uniFPrintfPL', {
        name: 'uniFPrintfPL',
        returnType: 'int',
        parameters: [{ name: 'file', type: 'file' }, { name: 'format', type: 'string' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Writes to a file similar to uniFPrintf() except changes to the current WinCC OA language before converting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniFPrintfPL.html'
    }],
    ['uniFPrintfUL', {
        name: 'uniFPrintfUL',
        returnType: 'int',
        parameters: [{ name: 'file', type: 'file' }, { name: 'format', type: 'string' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Writes to a file similar to uniFPrintf() except changes to the current Windows user language before converting.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniFPrintfUL.html'
    }],
    ['uniPatternMatch', {
        name: 'uniPatternMatch',
        returnType: 'bool',
        parameters: [{ name: 'pattern', type: 'string' }, { name: 's', type: 'string' }],
        description: 'Checks whether particular string have a specific pattern.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniPatternMatch.html'
    }],
    ['uniSPrintf', {
        name: 'uniSPrintf',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string', byRef: true }, { name: '[', type: 'string format' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Formats a string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniSPrintf.html'
    }],
    ['uniSPrintf', {
        name: 'uniSPrintf',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string', byRef: true }, { name: '[', type: 'string format' }, { name: '[', type: '<type1> var1' }, { name: 'var2...]]', type: '<type2>' }],
        description: 'Formats a string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniSPrintf.html'
    }],
    ['uniStrChange', {
        name: 'uniStrChange',
        returnType: 'int',
        parameters: [{ name: 'source', type: 'string', byRef: true }, { name: 'from', type: 'unsigned' }, { name: 'count', type: 'unsigned' }, { name: 'replace', type: 'string' }],
        description: 'Changes the content of a string at a specific index for a defined count of digits with a replacing string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniStrChange.html'
    }],
    ['uniStrExpand', {
        name: 'uniStrExpand',
        returnType: 'string',
        parameters: [{ name: 's', type: 'string' }, { name: 'length', type: 'unsigned' }],
        description: 'Returns a formatted string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniStrExpand.html'
    }],
    ['uniStrformat', {
        name: 'uniStrformat',
        returnType: 'string',
        parameters: [{ name: 'format', type: 'string' }, { name: 'len', type: 'int' }, { name: 'value', type: 'anytype' }],
        description: 'Returns a formatted string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniStrFormat.html'
    }],
    ['uniStrLen', {
        name: 'uniStrLen',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }],
        description: 'Returns the length of a string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniStrLen.html'
    }],
    ['uniStrPos', {
        name: 'uniStrPos',
        returnType: 'int',
        parameters: [{ name: 's', type: 'string' }, { name: 'searchstr[', type: 'string' }, { name: 'startPos', type: 'int' }],
        description: 'Returns the position of a string within another.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniStrPos.html'
    }],
    ['uniStrTok', {
        name: 'uniStrTok',
        returnType: 'int',
        parameters: [{ name: '[', type: 'string s' }, { name: 'set]', type: 'string' }],
        description: 'Searches a string for the first occurrence of any of a set of characters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniStrTok.html'
    }],
    ['uniStrToLower', {
        name: 'uniStrToLower',
        returnType: 'string',
        parameters: [{ name: 'text', type: 'string' }],
        description: 'Changes a string to lowercase.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniStrToLower.html'
    }],
    ['uniStrToUpper', {
        name: 'uniStrToUpper',
        returnType: 'string',
        parameters: [{ name: 'text', type: 'string' }],
        description: 'Converts a lower-case string to a string in capital letters.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniStrToUpper.html'
    }],
    ['uniSubStr', {
        name: 'uniSubStr',
        returnType: 'string',
        parameters: [{ name: 's', type: 'string' }, { name: '[', type: 'int pos' }, { name: 'len]', type: 'int' }],
        description: 'Cuts a string or a character of a certain length (characters) out of another string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uniSubStr.html'
    }],
    ['unzip', {
        name: 'unzip',
        returnType: 'int',
        parameters: [{ name: 'zipArchiveFile', type: 'const string', byRef: true }, { name: 'destinationDir', type: 'string' }, { name: 'logFilePath', type: 'string' }],
        description: 'The function unpacks a file into a specified directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/unzip.html'
    }],
    ['useQueryRDBDirect', {
        name: 'useQueryRDBDirect',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks if RDB (Oracle) is used for queries.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/useQueryRDBDirect.html'
    }],
    ['useRDBArchive', {
        name: 'useRDBArchive',
        returnType: 'bool',
        parameters: [],
        description: 'The function useRDBArchive() checks if RDB archives are used for the archiving in a project.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/useRDBArchive.html'
    }],
    ['useRDBGroups', {
        name: 'useRDBGroups',
        returnType: 'bool',
        parameters: [],
        description: 'The function useRDBGroups() checks if RDB groups are used for archiving.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/useRDBGroups.html'
    }],
    ['userDefFunc', {
        name: 'userDefFunc',
        returnType: 'int',
        parameters: [{ name: 'libName', type: 'string' }, { name: 'fctName', type: 'string' }, { name: 'in', type: 'dyn_anytype' }, { name: 'out', type: 'dyn_anytype', byRef: true }],
        description: 'Calls C++ functions.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/userDefFunc.html'
    }],
    ['usesTouchScreen', {
        name: 'usesTouchScreen',
        returnType: 'bool',
        parameters: [],
        description: 'Query if the UI is currently using touch-input mode or mouse mode..',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/usesTouchScreen.html'
    }],
    ['useValueArchive', {
        name: 'useValueArchive',
        returnType: 'bool',
        parameters: [],
        description: 'The function checks whether the valueArchive archiving is used.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/useValueArchive.html'
    }],
    ['uss_getGenericSetting', {
        name: 'uss_getGenericSetting',
        returnType: 'int',
        parameters: [{ name: 'cType', type: 'char' }, { name: 'sUserOrGroupName', type: 'string' }, { name: 'dsSettingName', type: 'dyn_string', byRef: true }, { name: 'ddaContent', type: 'dyn_dyn_anytype', byRef: true }],
        description: 'Reads all user or user group settings without hierarchy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uss_getGenericSetting.html'
    }],
    ['uss_getMyUsergroup', {
        name: 'uss_getMyUsergroup',
        returnType: 'string',
        parameters: [{ name: 'sUserName', type: 'string' }],
        description: 'Returns the user group with the lowest position ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uss_getMyUsergroup.html'
    }],
    ['uss_getSpecificSetting', {
        name: 'uss_getSpecificSetting',
        returnType: 'int',
        parameters: [{ name: 'sPrefix', type: 'string' }, { name: 'sGroupOrUser', type: 'string' }, { name: 'sSettingName', type: 'string' }, { name: 'sFormat', type: 'string', byRef: true }, { name: 'dsContent', type: 'dyn_string', byRef: true }, { name: 'lsName', type: 'langString', byRef: true }],
        description: 'Reads a specific user(group) setting without hierarchy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uss_getSpecificSetting.html'
    }],
    ['uss_getSpecificUserSetting', {
        name: 'uss_getSpecificUserSetting',
        returnType: 'int',
        parameters: [{ name: 'sUser', type: 'string' }, { name: 'sSettingName', type: 'string' }, { name: 'sFormat', type: 'string', byRef: true }, { name: 'sContent', type: 'dyn_string', byRef: true }, { name: 'lsName', type: 'langString', byRef: true }],
        description: 'Reads a specific user setting with hierarchy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uss_getSpecificUserSetting.html'
    }],
    ['uss_getUserSettings', {
        name: 'uss_getUserSettings',
        returnType: 'int',
        parameters: [{ name: 'sUser', type: 'string' }, { name: 'dsSettingNames', type: 'dyn_string', byRef: true }, { name: 'dsFormat', type: 'dyn_string', byRef: true }, { name: 'ddaContent', type: 'dyn_dyn_anytype', byRef: true }],
        description: 'Reads all user settings with hierarchy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/uss_getUserSettings.html'
    }],
    ['usr_deleteSetting', {
        name: 'usr_deleteSetting',
        returnType: 'int',
        parameters: [{ name: 'sUser', type: 'string' }, { name: 'sSettingName', type: 'string' }],
        description: 'Deletes a user setting from the configuration management.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/usr_deleteSetting.html'
    }],
    ['v24Close', {
        name: 'v24Close',
        returnType: 'int',
        parameters: [{ name: 'handle', type: 'int' }],
        description: 'Closes the interface.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/v24Close.html'
    }],
    ['v24Open', {
        name: 'v24Open',
        returnType: 'int',
        parameters: [{ name: 'port', type: 'string' }, { name: 'baudrate', type: 'int' }, { name: 'options', type: 'string' }],
        description: 'Opens a serial interface with a defined baudrate.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/v24Open.html'
    }],
    ['v24Read', {
        name: 'v24Read',
        returnType: 'int',
        parameters: [{ name: 'handle', type: 'int' }, { name: 'value', type: 'string/blob', byRef: true }, { name: 'timeout', type: 'time' }],
        description: 'Reads from the interface.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/v24Read.html'
    }],
    ['v24Write', {
        name: 'v24Write',
        returnType: 'int',
        parameters: [{ name: 'handle', type: 'int' }, { name: 'value', type: 'string / blob' }],
        description: 'Writes data to the interface.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/v24Write.html'
    }],
    ['verifyOSUser', {
        name: 'verifyOSUser',
        returnType: 'int',
        parameters: [{ name: 'password', type: 'string' }, { name: 'result[', type: 'bool' }, { name: 'username[', type: 'string' }, { name: 'level]]', type: 'int' }],
        description: 'The function returns TRUE (in the &result parameter) if the user with the defined user name exists, the account of the user is not locked or disabled and the specified password is correct. The default user is the current operating system user.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/UserAdmin/verifyOSUser.html'
    }],
    ['waitThread', {
        name: 'waitThread',
        returnType: 'int',
        parameters: [{ name: 'threadId', type: 'int' }, { name: 'log', type: 'bool' }],
        description: 'Waits for the end of the specified thread.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/waitThread.html'
    }],
    ['webSocketOpen', {
        name: 'webSocketOpen',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }],
        description: 'The function closes the given WebSocket connection. The WebSocket number is the return value of webSocketOpen().',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/webSocketClose.html'
    }],
    ['webSocketOpen', {
        name: 'webSocketOpen',
        returnType: 'int',
        parameters: [{ name: '[', type: 'string url' }, { name: 'options]', type: 'mapping' }],
        description: 'Opens a WebSocket connection to the given url.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/webSocketOpen.html'
    }],
    ['webSocketRead', {
        name: 'webSocketRead',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }, { name: 'data', type: 'anytype|string|blob', byRef: true }, { name: 'maxTimeout]', type: 'time' }],
        description: 'Tries to retrieve the next message form the WebSocket.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/webSocketRead.html'
    }],
    ['webSocketWrite', {
        name: 'webSocketWrite',
        returnType: 'int',
        parameters: [{ name: 'socket', type: 'int' }, { name: 'data', type: 'string|blob' }],
        description: 'Writes data to the given WebSocket.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/webSocketWrite.html'
    }],
    ['weekDay', {
        name: 'weekDay',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the weekday of a time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/weekDay.html'
    }],
    ['windowStyle', {
        name: 'windowStyle',
        returnType: 'int',
        parameters: [{ name: 'moduleName', type: 'string' }, { name: 'panelName', type: 'string' }, { name: 'systemMenu', type: 'bool' }, { name: 'minimizeBox', type: 'bool' }],
        description: 'The function windowStyle() can be used to deactivate the control menu or only the minimize box',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/windowStyle.html'
    }],
    ['writeAuditBatchEntry', {
        name: 'writeAuditBatchEntry',
        returnType: 'void',
        parameters: [],
        description: 'The function is used e.g. in production processes and it writes the batch id, the data point element the executed action had an influence on, the datapoint type, the executed action and the reason why the action was executed.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/writeAuditBatchEntry.html'
    }],
    ['writeAuditEntry', {
        name: 'writeAuditEntry',
        returnType: 'void',
        parameters: [],
        description: 'The function writeAuditEntry is used to write set point values into the Audit trail panel.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/writeAuditEntry.html'
    }],
    ['wss_getGenericSetting', {
        name: 'wss_getGenericSetting',
        returnType: 'int',
        parameters: [{ name: 'sWorkstationName', type: 'string' }, { name: 'dsSettingName', type: 'dyn_string', byRef: true }, { name: 'ddaContent', type: 'dyn_dyn_anytype', byRef: true }],
        description: 'Reads all workstation settings without hierarchy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/wss_getGenericSetting.html'
    }],
    ['wss_getSpecificSetting', {
        name: 'wss_getSpecificSetting',
        returnType: 'int',
        parameters: [{ name: 'sPrefix', type: 'string' }, { name: 'sWorkstation', type: 'string' }, { name: 'sSettingName', type: 'string' }, { name: 'sFormat', type: 'string', byRef: true }, { name: 'dsContent', type: 'dyn_string', byRef: true }, { name: 'lsName', type: 'langString', byRef: true }],
        description: 'Reads a specific workstation setting without hierarchy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/wss_getSpecificSetting.html'
    }],
    ['wss_getSpecificWorkstationSetting', {
        name: 'wss_getSpecificWorkstationSetting',
        returnType: 'int',
        parameters: [{ name: 'sWorkstation', type: 'string' }, { name: 'sSettingName', type: 'string' }, { name: 'sFormat', type: 'string', byRef: true }, { name: 'dsContent', type: 'dyn_string', byRef: true }, { name: 'lsName', type: 'langString', byRef: true }],
        description: 'Reads a specific workstation setting with hierarchy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/wss_getSpecificWorkstationSetting.html'
    }],
    ['wss_getWorkstationSettings', {
        name: 'wss_getWorkstationSettings',
        returnType: 'int',
        parameters: [{ name: 'sWorkstation', type: 'string' }, { name: 'dsSettingNames', type: 'dyn_string', byRef: true }, { name: 'dsFormat', type: 'dyn_string', byRef: true }, { name: 'ddaContent', type: 'dyn_dyn_anytype', byRef: true }],
        description: 'Reads all workstation settings with hierarchy.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/wss_getWorkstationSettings.html'
    }],
    ['xmlAppendChild', {
        name: 'xmlAppendChild',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'int' }, { name: '[', type: 'int nodeType' }, { name: 'value]', type: 'string' }],
        description: 'Adds a new child node into the DOM tree as child of given node. Optionally the node\'s value can be set.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlAppendChild.html'
    }],
    ['xmlChildNodes', {
        name: 'xmlChildNodes',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }, { name: 'nodes', type: 'dyn_uint', byRef: true }],
        description: 'Writes all child nodes of the given node into the nodes\' reference parameter.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlChildNodes.html'
    }],
    ['xmlCloseDocument', {
        name: 'xmlCloseDocument',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }],
        description: 'Closes the created XML document and destroys the occupied memory. After this call, the document ID is no longer valid.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlCloseDocument.html'
    }],
    ['xmlDocumentFromFile', {
        name: 'xmlDocumentFromFile',
        returnType: 'int',
        parameters: [{ name: 'fileName', type: 'string' }, { name: 'errMsg', type: 'string', byRef: true }, { name: 'errLine', type: 'int', byRef: true }, { name: 'errColumn', type: 'int', byRef: true }],
        description: 'Opens a file and reads the complete content building the DOM structure in memory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlDocumentFromFile.html'
    }],
    ['xmlDocumentFromString', {
        name: 'xmlDocumentFromString',
        returnType: 'int',
        parameters: [{ name: 'xml', type: 'string' }, { name: 'errMsg', type: 'string', byRef: true }, { name: 'errLine', type: 'int', byRef: true }, { name: 'errColumn', type: 'int', byRef: true }],
        description: 'Reads the complete content from a string and builds the DOM structure in memory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlDocumentFromString.html'
    }],
    ['xmlDocumentToFile', {
        name: 'xmlDocumentToFile',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'fileName', type: 'string' }],
        description: 'Stores the internal DOM tree in an arbitrary XML file.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlDocumentToFile.html'
    }],
    ['xmlDocumentToString', {
        name: 'xmlDocumentToString',
        returnType: 'string',
        parameters: [{ name: 'doc', type: 'unsigned' }],
        description: 'Returns the internal DOM tree as a string result.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlDocumentToString.html'
    }],
    ['xmlElementAttributes', {
        name: 'xmlElementAttributes',
        returnType: 'mapping',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }],
        description: 'Returns all node attributes as a mapping.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlElementAttributes.html'
    }],
    ['xmlFirstChild', {
        name: 'xmlFirstChild',
        returnType: 'int',
        parameters: [{ name: 'doc[', type: 'unsigned' }, { name: 'node]', type: 'unsigned' }],
        description: 'Returns an internal ID to the first child node in the DOM tree.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlFirstChild.html'
    }],
    ['xmlGetElementAttribute', {
        name: 'xmlGetElementAttribute',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }, { name: 'attr', type: 'string' }, { name: 'value', type: 'string', byRef: true }],
        description: 'Reads the value of the given attribute into the value reference parameter of the node.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlGetElementAttribute.html'
    }],
    ['xmlIsSameNode', {
        name: 'xmlIsSameNode',
        returnType: 'bool',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node1', type: 'unsigned' }, { name: 'node2', type: 'unsigned' }],
        description: 'Checks whether two node IDs are pointing to the same internal node within the DOM tree.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlIsSameNode.html'
    }],
    ['xmlNamedChild', {
        name: 'xmlNamedChild',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'name[', type: 'string' }, { name: 'node]', type: 'unsigned' }],
        description: 'This function allows you to easily find a child node in an xml document.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlNamedChild.html'
    }],
    ['xmlNewDocument', {
        name: 'xmlNewDocument',
        returnType: 'int',
        parameters: [],
        description: 'Starts the creation of a new document in memory and returns the document ID.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlNewDocument.html'
    }],
    ['xmlNextSibling', {
        name: 'xmlNextSibling',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }],
        description: 'Returns an internal ID for the next sibling of the given node.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlNextSibling.html'
    }],
    ['xmlNodeName', {
        name: 'xmlNodeName',
        returnType: 'string',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }],
        description: 'Returns the name of a node.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlNodeName.html'
    }],
    ['xmlNodePosition', {
        name: 'xmlNodePosition',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }, { name: 'line', type: 'int', byRef: true }, { name: 'column', type: 'int', byRef: true }],
        description: 'The function returns the position of a node inside of an XML document.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlNodePosition.html'
    }],
    ['xmlNodeType', {
        name: 'xmlNodeType',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }],
        description: 'Returns the type of the given node.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlNodeType.html'
    }],
    ['xmlNodeValue', {
        name: 'xmlNodeValue',
        returnType: 'string',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }],
        description: 'Returns the value of the given node.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlNodeValue.html'
    }],
    ['xmlParentNode', {
        name: 'xmlParentNode',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }],
        description: 'Returns the internal ID for the parent node of the given node.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlParentNode.html'
    }],
    ['xmlRemoveElementAttribute', {
        name: 'xmlRemoveElementAttribute',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }, { name: 'attr', type: 'string' }],
        description: 'Removes the given attribute from its node.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlRemoveElementAttribute.html'
    }],
    ['xmlRemoveNode', {
        name: 'xmlRemoveNode',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'int' }],
        description: 'Removes the given node from its parent node.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlRemoveNode.html'
    }],
    ['xmlSetElementAttribute', {
        name: 'xmlSetElementAttribute',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }, { name: 'attr', type: 'string' }, { name: 'value', type: 'string' }],
        description: 'Sets the attribute of a node to given value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlSetElementAttribute.html'
    }],
    ['xmlSetNodeValue', {
        name: 'xmlSetNodeValue',
        returnType: 'int',
        parameters: [{ name: 'doc', type: 'unsigned' }, { name: 'node', type: 'unsigned' }, { name: 'value', type: 'string' }],
        description: 'Sets the node\'s value to the given value.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlSetNodeValue.html'
    }],
    ['xmlrpcCall', {
        name: 'xmlrpcCall',
        returnType: 'int',
        parameters: [{ name: 'id', type: 'string' }, { name: 'function', type: 'string' }, { name: '[', type: 'dyn_mixed args' }, { name: 'result]', type: 'mixed' }],
        description: 'Calls the function "function" on the server with the arguments of the parameter "args". If "result" is specified, the function waits for the answer from the server and saves the answer in "result". This corresponds to the call result = function(args[1],...);',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcCall.html'
    }],
    ['xmlrpcClient', {
        name: 'xmlrpcClient',
        returnType: 'void',
        parameters: [],
        description: 'Starts an XmlRpc client. The XmlRpc client is a Ctrl module that handles the calls in the background.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcClient.html'
    }],
    ['xmlrpcConnectToServer', {
        name: 'xmlrpcConnectToServer',
        returnType: 'void',
        parameters: [],
        description: 'Establishes a connection to an XmlRpc server on host "host" and port "port". If "secure" is TRUE, a https connection is built. Under Windows the OpenSSL installation is required. The connection is valid only as long as it is open. This means if the connection is broken, the requests for the server will fail. Using the parameter "id", the server can be identified in the following calls.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcConnectToServer.html'
    }],
    ['xmlrpcCloseServer', {
        name: 'xmlrpcCloseServer',
        returnType: 'void',
        parameters: [],
        description: 'Closes the connection to the server.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcCloseServer.html'
    }],
    ['xmlrpcDecodeRequest', {
        name: 'xmlrpcDecodeRequest',
        returnType: 'void',
        parameters: [],
        description: 'Decodes the request and extracts the function name and arguments of it.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcDecodeRequest.html'
    }],
    ['xmlrpcDecodeValue', {
        name: 'xmlrpcDecodeValue',
        returnType: 'int',
        parameters: [{ name: 'res', type: 'string' }, { name: 'value[', type: 'anytype', byRef: true }, { name: 'isUTF', type: 'bool' }],
        description: 'Re-converts an XmlRpc-coded string to a variable.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcDecodeValue.html'
    }],
    ['xmlrpcEncodeResponse', {
        name: 'xmlrpcEncodeResponse',
        returnType: 'void',
        parameters: [],
        description: 'Encodes the result in an XmlRpc message.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcEncodeResponse.html'
    }],
    ['xmlrpcEncodeValue', {
        name: 'xmlrpcEncodeValue',
        returnType: 'int',
        parameters: [{ name: 'value', type: 'anytype' }, { name: 'res[', type: 'string', byRef: true }, { name: 'forceUTF', type: 'bool' }],
        description: 'Converts a "value" variable to an XmlRpc-coded string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcEncodeValue.html'
    }],
    ['xmlrpcHandler', {
        name: 'xmlrpcHandler',
        returnType: 'mixed',
        parameters: [{ name: 'content', type: 'string' }],
        description: 'CtrlXmlRpc is a CTRL extension including XML-RPC functions. XML-RPC is a protocol for web services, similar to SOAP but much simpler.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcHandler.html'
    }],
    ['xmlrpcSetGzipLimit', {
        name: 'xmlrpcSetGzipLimit',
        returnType: 'bool',
        parameters: [{ name: 'id', type: 'string' }, { name: 'limit', type: 'uint' }],
        description: 'Defines from which size the contents of a request are compressed (gzip).',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/xmlrpcSetGzipLimit.html'
    }],
    ['yamlDecode', {
        name: 'yamlDecode',
        returnType: 'anytype',
        parameters: [{ name: 'yaml', type: 'string' }, { name: 'resolveAliasAnchor', type: 'bool' }],
        description: 'Decodes a string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/yamlDecode.html'
    }],
    ['yamlEncode', {
        name: 'yamlEncode',
        returnType: 'string',
        parameters: [{ name: 'data', type: 'dyn_mapping' }],
        description: 'Encodes a string.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/yamlEncode.html'
    }],
    ['year', {
        name: 'year',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the year of a time.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/year.html'
    }],
    ['yearDay', {
        name: 'yearDay',
        returnType: 'int',
        parameters: [{ name: 't', type: 'time' }],
        description: 'Returns the day of a time as a value between 1 and 366.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/yearDay.html'
    }],
    ['ZoomModule', {
        name: 'ZoomModule',
        returnType: 'void',
        parameters: [{ name: 'module', type: 'string' }, { name: 'factor', type: 'float' }, { name: 'x', type: 'int' }, { name: 'y', type: 'int' }],
        description: 'Zooms the content of the UI module and resets the position of the panel in the module.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/ZoomModule.html'
    }],
    ['zipDir', {
        name: 'zipDir',
        returnType: 'int',
        parameters: [{ name: 'dir', type: 'const string', byRef: true }, { name: 'zipArchiveFile', type: 'const string', byRef: true }, { name: 'includeDir', type: 'bool' }],
        description: 'The function creates a zip file from the specified directory.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/zipDir.html'
    }],
    ['zipFiles', {
        name: 'zipFiles',
        returnType: 'int',
        parameters: [{ name: 'filesToZip', type: 'const dyn_string', byRef: true }, { name: 'zipArchiveFile', type: 'const string', byRef: true }],
        description: 'Creates a zip file from given file list.',
        docUrl: 'https://www.winccoa.com/documentation/WinCCOA/latest/en_US/ControlS_Z/zipFiles.html'
    }]
]);

export function isBuiltinFunction(name: string): boolean {
    return BUILTIN_FUNCTIONS.has(name);
}

export function getBuiltinFunction(name: string): FunctionSignature | undefined {
    return BUILTIN_FUNCTIONS.get(name);
}

export function getAllBuiltinFunctions(): FunctionSignature[] {
    return Array.from(BUILTIN_FUNCTIONS.values());
}
