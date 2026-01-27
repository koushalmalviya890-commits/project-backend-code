const fillContractTemplate = async ({
  serviceProviderName,
  entityType,
  aadhaarNumber,
  residentialAddress,
  businessAddress
}) => {
const today = new Date();
const date = today.getDate();
const month = today.toLocaleString('default', { month: 'long' }); // e.g., "July"
const year = today.getFullYear();
const formattedDate = `${date}${getDaySuffix(date)}`; // e.g., "26th"

// console.log('Date:', formattedDate);
// console.log('Month:', month);
// console.log('Year:', year);

  const html = `
 <!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; /* or center for vertical centering */
        min-height: 100vh;
        margin: 0;
     
	 
      }

      p {
        margin: 0;
        padding: 0;
      }
      .ft10 {
        font-size: 16px;
        font-family: AAAAAA + Carlito;
        color: #000000;
      }
      .ft11 {
        font-size: 17px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft12 {
        font-size: 17px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft13 {
        font-size: 16px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft14 {
        font-size: 17px;
        line-height: 21px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft15 {
        font-size: 17px;
        line-height: 23px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft16 {
        font-size: 16px;
        line-height: 23px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page1-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATyklEQVR42u3YwQnAMBADQcu4/5aVEgKGC3nMlKDX3qXtAgCASdsEAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAABEpwkAABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AAIhOEwAAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQBAdAIAIDoBABCdAABw65gAvpHECPBPbY0A03w6AQAYF+cdAADTfDoBABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBABCdJgAAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAIDpNAACA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBABAdAIAgOgEAEB0AgCA6AQAQHQCACA6AQBAdAIAIDoBABCdAAAgOgEAEJ0AACA6AQAQnQAAiE4AABCdAACITgAARCcAAIhOAABEJwAAiE4AAEQnAACiEwAARCcAAKITAADRCQAAohMAANEJAACiEwAA0QkAgOgEAADRCQCA6AQAQHQCAIDoBABAdAIAgOgEAEB0AgAgOgEAQHQCACA6AQAQnQAAIDoBABCdAAAgOgEAEJ0AAIhOAAAQnQAAiE4AAEQnAACITgAARCcAAIhOAABEJwAAohMAAEQnAACiEwAA0QkAAKITAADRCQAAohMAANEJAIDoBAAA0QkAgOgEAEB0AgCA6AQAQHQCAIDoBABAdAIAIDoBAEB0AgAgOgEAEJ0AACA6AQAQnQAAIDoBABCdAACITgAAEJ0AAIhOAABEJwAAiE4AAEQnAACITgAARCcAAKITAABEJwAAohMAANEJAACiEwAA0QkAAKITAADRCQCA6AQAANEJAIDoBABAdJoAAADRCQCA6AQAgDcPnLoS2ZuQFjIAAAAASUVORK5CYII="
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft10"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft14"
      >
         <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> 
      </p>
      <p
        style="position: absolute; top: 578px; left: 447px; white-space: nowrap"
        class="ft11"
      >
         
      </p>
      <p
        style="position: absolute; top: 599px; left: 292px; white-space: nowrap"
        class="ft12"
      >
        <b>FACILITY PROVIDER AGREEMENT </b>
      </p>
      <p
        style="position: absolute; top: 621px; left: 108px; white-space: nowrap"
        class="ft14"
      >
         <br />This &#160;Facility &#160;Provider &#160;Agreement is &#160;entered &#160;into &#160;on &#160;this &#160;the &#160;<b>${date}</b>&#160;day &#160;of <br /><b
          >${month}</b
        > &#160;${year} and is executed at ${businessAddress}
         
      </p>
      <p
        style="position: absolute; top: 685px; left: 447px; white-space: nowrap"
        class="ft11"
      >
         
      </p>
      <p
        style="position: absolute; top: 724px; left: 367px; white-space: nowrap"
        class="ft11"
      >
        BY AND BETWEEN 
      </p>
      <p
        style="position: absolute; top: 764px; left: 108px; white-space: nowrap"
        class="ft15"
      >
        <b>IDAMUMAI TECHNOLOGIES PRIVATE LIMITED</b
        > a Company incorporated under the <br />Companies Act, 2013 and operating under &#160;the &#160;brand &#160;name &#160;<b>CUMMA &#160;(“CUMMA”)</b> &#160;having <br />its &#160;registered &#160;office &#160;at &#160;46A, &#160;Anna &#160;Nagar &#160;II &#160;Street, &#160;Linganur, &#160;Vadavalli, &#160;Coimbatore &#160;– &#160;641041, <br />(hereinafter referred to as the “<b>Company</b>” which expression shall, unless &#160;it &#160;be &#160;repugnant &#160;to <br />the context or meaning thereof be deemed to mean and include its representatives, assignees <br />and administrators) of the FIRST PART; 
      </p>
      <p
        style="position: absolute; top: 918px; left: 453px; white-space: nowrap"
        class="ft11"
      >
        AND 
      </p>
      <p
  style="
    position: absolute;
    top: 957px;
    left: 108px;
    max-width: 700px;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
    line-height: 1.6;
    font-family: 'Times New Roman', serif;
    font-size: 18px;
  "
  class="ft14"
>
  <b>${entityType}</b> owned by <b>${serviceProviderName}</b>
  // , residing at  
  // <br />
  // <b>${residentialAddress}</b> and having his/her business at  
  // <br />
  // <b>${businessAddress}</b> 
  (hereinafter called the “<b>Facility Provider</b>”)  
  <br /><br />
  which expression shall, unless it be repugnant to the context  
  or meaning thereof, be deemed to mean and include its partners, heirs, executors,  
  administrators, representatives and assigns of the SECOND PART;
  The Company and the Facility Provider shall individually be referred to as “Party” and  
  collectively as “Parties” hereinafter.
</p>

      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft10"
      >
        &#160;
      </p>
    </div>
    
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      <!--
      	p {margin: 0; padding: 0;}	.ft20{font-size:16px;font-family:AAAAAA+Carlito;color:#000000;}
      	.ft21{font-size:17px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft22{font-size:17px;font-family:CAAAAA+LiberationSerif;color:#000000;}
      	.ft23{font-size:17px;line-height:21px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft24{font-size:17px;line-height:24px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      -->
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page2-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft20"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft23"
      >
        WHEREAS, the Company owns and operates an e-commerce Platform under the brand name <br />&#34;CUMMA”, &#160;which &#160;includes &#160;a &#160;website &#160;designed &#160;to &#160;facilitate &#160;the &#160;listing &#160;and &#160;booking &#160;of <br />Products and services for lease by various Facility Providers to the Users; <br /> <br />AND WHEREAS, the Facility Provider is desirous of listing and renting its Products and/or <br />Facilities &#160;through &#160;the &#160;Company’s &#160;Platform &#160;as &#160;defined &#160;under &#160;this &#160;Agreement, &#160;leveraging &#160;its <br />expertise, infrastructure, and resources to ensure efficient operations; <br /> <br />In &#160;consideration &#160;of &#160;the &#160;mutual &#160;promises &#160;and &#160;covenants &#160;hereinafter &#160;contained, &#160;it &#160;is &#160;hereby <br />agreed by and between the parties, as follows:-  <br /> 
      </p>
      <p
        style="position: absolute; top: 371px; left: 102px; white-space: nowrap"
        class="ft22"
      >
        <b>1.&#160;DEFINITIONS: </b>
      </p>
      <p
        style="position: absolute; top: 410px; left: 108px; white-space: nowrap"
        class="ft21"
      >
        a.&#160;“<b>Agreement</b>” &#160;means &#160;this &#160;Facility &#160;Provider &#160;Agreement &#160;and &#160;any &#160;and &#160;all &#160;attachments, 
      </p>
      <p
        style="position: absolute; top: 432px; left: 124px; white-space: nowrap"
        class="ft23"
      >
        annexures &#160;and &#160;exhibits &#160;attached &#160;to &#160;it, &#160;or &#160;incorporated &#160;in &#160;it &#160;by &#160;reference, &#160;and &#160;shall &#160;also <br />include any extensions/addendum(s)/amendments (if any) to this &#160;Agreement, &#160;all &#160;of &#160;which <br />shall form an integral part of the Agreement. 
      </p>
      <p
        style="position: absolute; top: 514px; left: 102px; white-space: nowrap"
        class="ft21"
      >
        b.&#160;“<b>Company’s &#160;Policies</b>” &#160;include &#160;Non-Disclosure &#160;Agreement, &#160;Privacy &#160;Policy, &#160;User 
      </p>
      <p
        style="position: absolute; top: 535px; left: 129px; white-space: nowrap"
        class="ft23"
      >
        Agreement, Cancellation Policy, Refund Policy and any other policies, rules, guidelines as <br />communicated &#160;by &#160;the &#160;Company &#160;from &#160;time &#160;to &#160;time &#160;including &#160;any &#160;modifications &#160;or <br />amendments &#160;thereof, &#160;in &#160;the &#160;form &#160;of &#160;hard &#160;copies &#160;or &#160;electronic &#160;data &#160;communicated &#160;or <br />available &#160;in &#160;the &#160;website/application &#160;of &#160;CUMMA, &#160;which &#160;are &#160;executed &#160;or &#160;deemed &#160;to &#160;be <br />executed between the Parties hereunder. 
      </p>
      <p
        style="position: absolute; top: 660px; left: 102px; white-space: nowrap"
        class="ft21"
      >
        c.&#160;“<b>Confidential &#160;Information</b>” &#160;shall &#160;mean &#160;(i) &#160;information &#160;relating &#160;to &#160;the &#160;business, &#160;affairs, 
      </p>
      <p
        style="position: absolute; top: 681px; left: 129px; white-space: nowrap"
        class="ft23"
      >
        performance, &#160;finance &#160;and &#160;Intellectual &#160;Property &#160;Rights, &#160;treated &#160;as &#160;confidential &#160;by &#160;it &#160;and <br />trade &#160;secrets &#160;(including &#160;without &#160;limitation, &#160;technical &#160;data &#160;and &#160;know-how) &#160;of &#160;and/or <br />relating to &#160;the &#160;business, &#160;directors &#160;and &#160;shareholders &#160;of &#160;the &#160;Company, &#160;Users &#160;and &#160;affiliates <br />including &#160;other &#160;facility &#160;providers &#160;in &#160;the &#160;Platform; &#160;(ii) &#160;any &#160;information &#160;whatsoever <br />concerning &#160;or &#160;relating &#160;to &#160;(a) &#160;this &#160;Agreement &#160;in &#160;its &#160;entirety; &#160;or &#160;(b) &#160;any &#160;dispute &#160;or &#160;claim <br />arising out of or in connection with this Agreement; or (c) the resolution of such claim or <br />dispute, &#160;and &#160;(iii) &#160;any &#160;information &#160;or &#160;material &#160;prepared &#160;by &#160;or &#160;for &#160;the &#160;Company &#160;or &#160;its <br />representatives that contain or are generated from Confidential Information, irrespective of <br />its form and manner (iv) any personal information of the affiliates including other facility <br />providers in the Platform or employees or personnel or proprietors or partners or directors <br />of &#160;the &#160;Company, &#160;other &#160;information &#160;which &#160;is &#160;confidential &#160;or &#160;commercially &#160;sensitive <br />including &#160;but &#160;not &#160;limited &#160;to &#160;business &#160;methods, &#160;management &#160;systems, &#160;marketing &#160;plans, <br />strategic &#160;plans, &#160;finances, &#160;new &#160;or &#160;maturing &#160;business &#160;opportunities, &#160;marketing &#160;activities, <br />processes, inventions, designs &#160;or &#160;similar, &#160;relating &#160;to &#160;the &#160;Company &#160;or &#160;its &#160;personnel &#160;or &#160;its <br />associates or its affiliates including other facility providers in the Platform or its Users.  
      </p>
      <p
        style="
          position: absolute;
          top: 1020px;
          left: 102px;
          white-space: nowrap;
        "
        class="ft21"
      >
        d.&#160;“<b>Facility(ies)</b>” shall mean and include any and every &#160;facility &#160;such &#160;as &#160;co-working &#160;spaces, 
      </p>
      <p
        style="
          position: absolute;
          top: 1041px;
          left: 129px;
          white-space: nowrap;
        "
        class="ft23"
      >
        laboratory, studios, manufacturing facility etc., listed and provided by the Facility Provider <br />through the CUMMA Platform, along with all &#160;Products &#160;(as &#160;defined &#160;hereunder), &#160;ancillary <br />and support services, wherever the context suits.  
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft20"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      <!--
      	p {margin: 0; padding: 0;}	.ft30{font-size:16px;font-family:AAAAAA+Carlito;color:#000000;}
      	.ft31{font-size:17px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft32{font-size:17px;font-family:CAAAAA+LiberationSerif;color:#000000;}
      	.ft33{font-size:16px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft34{font-size:17px;line-height:21px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft35{font-size:17px;line-height:24px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      -->
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page3-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft30"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 126px; left: 102px; white-space: nowrap"
        class="ft31"
      >
        e.&#160;&#34;<b>Intellectual &#160;Property &#160;Rights</b>&#34; &#160;shall &#160;mean &#160;any &#160;and &#160;all &#160;now &#160;known &#160;or &#160;hereafter &#160;known 
      </p>
      <p
        style="position: absolute; top: 147px; left: 129px; white-space: nowrap"
        class="ft34"
      >
        tangible &#160;and &#160;intangible &#160;rights &#160;associated &#160;with &#160;intellectual &#160;properties &#160;such &#160;as &#160;works &#160;of <br />authorship, including but not limited to moral rights and mask-works; trademark and trade <br />name &#160;rights &#160;and &#160;similar &#160;rights; &#160;trade &#160;secrets; &#160;logos, &#160;trademarks, &#160;know-how, &#160;patents, <br />copyrights, &#160;design &#160;rights, &#160;rights &#160;relating &#160;to &#160;computer &#160;software, &#160;data, &#160;inventions, <br />discoveries, source codes, designs, software programs, applications, &#160;database, &#160;flowcharts, <br />depictions, &#160;summaries, &#160;materials, &#160;documentation, &#160;records, &#160;forms, &#160;compilations, <br />executables, &#160;binaries, &#160;discussion &#160;notes, &#160;any &#160;other &#160;industrial &#160;information, &#160;and &#160;all &#160;other <br />intellectual property rights of every kind and nature throughout the universe and however <br />designated, &#160;whether &#160;registered &#160;or &#160;not, &#160;whether &#160;arising &#160;by &#160;operation &#160;of &#160;law, &#160;contract, <br />license, or otherwise. 
      </p>
      <p
        style="position: absolute; top: 379px; left: 102px; white-space: nowrap"
        class="ft31"
      >
        f.&#160;<b>“Law” &#160;</b>or<b> &#160;“Laws”</b> &#160;shall &#160;mean &#160;all &#160;procedural &#160;and &#160;substantive &#160;laws, &#160;judicial &#160;decisions, 
      </p>
      <p
        style="position: absolute; top: 400px; left: 129px; white-space: nowrap"
        class="ft34"
      >
        statutes, &#160;enactments, &#160;acts &#160;of &#160;legislature, &#160;ordinances, &#160;rules, &#160;by-laws, &#160;regulations, <br />notifications, &#160;guidelines, &#160;policies, &#160;directions, &#160;directives, &#160;inter-departmental &#160;notifications <br />and &#160;circulars, &#160;orders &#160;and &#160;other &#160;requirements &#160;of &#160;any &#160;competent &#160;governmental &#160;authority, <br />having the effect of law in India; 
      </p>
      <p
        style="position: absolute; top: 504px; left: 102px; white-space: nowrap"
        class="ft31"
      >
        g.&#160;<b>“Platform” &#160;</b>shall &#160;refer &#160;to &#160;Cumma’s &#160;digital &#160;Platform &#160;where &#160;Facility &#160;Provider &#160;lists &#160;their 
      </p>
      <p
        style="position: absolute; top: 525px; left: 129px; white-space: nowrap"
        class="ft31"
      >
        Facilities.<b>  </b>
      </p>
      <p
        style="position: absolute; top: 564px; left: 102px; white-space: nowrap"
        class="ft31"
      >
        h.&#160;“<b>Product(s)</b>” shall mean and include any &#160;and &#160;every &#160;products, &#160;equipments, &#160;goods &#160;etc., &#160;in 
      </p>
      <p
        style="position: absolute; top: 586px; left: 129px; white-space: nowrap"
        class="ft34"
      >
        tangible &#160;form &#160;listed &#160;and &#160;rented/leased &#160;by &#160;the &#160;Facility &#160;Providers &#160;for &#160;usage &#160;at &#160;specific <br />designated place of the Facility Provider by the Users.  
      </p>
      <p
        style="position: absolute; top: 647px; left: 102px; white-space: nowrap"
        class="ft31"
      >
        i.&#160;“<b>User(s)</b>” &#160;shall &#160;mean &#160;the &#160;users &#160;of &#160;the &#160;CUMMA &#160;Platform, &#160;who &#160;avail &#160;Products &#160;and/or 
      </p>
      <p
        style="position: absolute; top: 668px; left: 129px; white-space: nowrap"
        class="ft34"
      >
        Facilities &#160;offered &#160;for &#160;lease, &#160;which &#160;would &#160;also &#160;include &#160;any &#160;prospective &#160;purchasers &#160;of &#160;the <br />Facilities.  
      </p>
      <p
        style="position: absolute; top: 729px; left: 102px; white-space: nowrap"
        class="ft31"
      >
         
      </p>
      <p
        style="position: absolute; top: 750px; left: 108px; white-space: nowrap"
        class="ft32"
      >
        <b>2. SCOPE AND NATURE: </b>
      </p>
      <p
        style="position: absolute; top: 789px; left: 135px; white-space: nowrap"
        class="ft31"
      >
        a.&#160;This Agreement governs the relationship between &#160;Cumma &#160;and &#160;the &#160;Facility &#160;Provider, 
      </p>
      <p
        style="position: absolute; top: 814px; left: 162px; white-space: nowrap"
        class="ft35"
      >
        and &#160;their &#160;rights &#160;and &#160;obligations &#160;regarding &#160;the &#160;listing, &#160;booking, &#160;and &#160;usage &#160;of &#160;its <br />Facilities through Cumma’s Platform.  
      </p>
      <p
        style="position: absolute; top: 882px; left: 135px; white-space: nowrap"
        class="ft31"
      >
        b.&#160;The &#160;Facility &#160;Provider &#160;shall &#160;operate &#160;as &#160;an &#160;independent &#160;contractor &#160;and &#160;shall &#160;have &#160;no 
      </p>
      <p
        style="position: absolute; top: 906px; left: 162px; white-space: nowrap"
        class="ft35"
      >
        authority &#160;to &#160;act &#160;as &#160;an &#160;agent, &#160;employee, &#160;or &#160;representative &#160;of &#160;Cumma. &#160;The &#160;Facility <br />Provider shall ensure that all Facilities &#160;offered &#160;through &#160;Cumma’s &#160;Platform &#160;adhere &#160;to <br />the agreed quality standards and comply with all applicable Laws. 
      </p>
      <p
        style="
          position: absolute;
          top: 1019px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft32"
      >
        <b>3. TERM AND BENEFITS:  </b>
      </p>
      <p
        style="
          position: absolute;
          top: 1060px;
          left: 135px;
          white-space: nowrap;
        "
        class="ft33"
      >
        a.
      </p>
      <p
        style="
          position: absolute;
          top: 1058px;
          left: 162px;
          white-space: nowrap;
        "
        class="ft35"
      >
        This Agreement shall remain in force originally for a period until the parties mutually <br />terminate commencing from the Effective Date of this Agreement. 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft30"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      <!--
      	p {margin: 0; padding: 0;}	.ft40{font-size:16px;font-family:AAAAAA+Carlito;color:#000000;}
      	.ft41{font-size:16px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft42{font-size:17px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft43{font-size:17px;font-family:CAAAAA+LiberationSerif;color:#000000;}
      	.ft44{font-size:17px;line-height:24px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft45{font-size:17px;line-height:21px;font-family:CAAAAA+LiberationSerif;color:#000000;}
      	.ft46{font-size:17px;line-height:21px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      -->
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page4-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft40"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 109px; left: 135px; white-space: nowrap"
        class="ft41"
      >
        b.
      </p>
      <p
        style="position: absolute; top: 108px; left: 162px; white-space: nowrap"
        class="ft44"
      >
        Upon expiration of the Term, this Agreement may be renewed for further periods vide <br />written &#160;Communication, &#160;in &#160;accordance &#160;with &#160;the &#160;terms &#160;and &#160;conditions &#160;under &#160;this <br />Agreement and/or upon the &#160;terms &#160;and &#160;conditions &#160;as &#160;may &#160;be &#160;agreed &#160;by &#160;and &#160;between <br />the Parties.   
      </p>
      <p
        style="position: absolute; top: 207px; left: 108px; white-space: nowrap"
        class="ft42"
      >
         
      </p>
      <p
        style="position: absolute; top: 246px; left: 108px; white-space: nowrap"
        class="ft46"
      >
        <b>4. REPRESENTATIONS AND WARRANTIES: <br /></b
        > <br />The Facility Provider represents and warrants as under: 
      </p>
      <p
        style="position: absolute; top: 328px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        a.&#160;The Facility Provider has full legal capacity and power &#160;to &#160;(a) &#160;enter &#160;into, &#160;exercise &#160;its 
      </p>
      <p
        style="position: absolute; top: 350px; left: 162px; white-space: nowrap"
        class="ft46"
      >
        rights and perform its obligations under this Agreement and (b) to own and to use its <br />respective Intellectual Property Rights for the purpose of this Agreement; 
      </p>
      <p
        style="position: absolute; top: 392px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        b.&#160;All &#160;approvals, &#160;permits &#160;and &#160;licenses &#160;are &#160;valid &#160;and &#160;subsisting &#160;and &#160;shall &#160;remain &#160;valid, 
      </p>
      <p
        style="position: absolute; top: 414px; left: 162px; white-space: nowrap"
        class="ft42"
      >
        subsisting during the Term of this Agreement; 
      </p>
      <p
        style="position: absolute; top: 435px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        c.&#160;The Facility Provider has the requisite power, license, consents, permissions, approval 
      </p>
      <p
        style="position: absolute; top: 456px; left: 162px; white-space: nowrap"
        class="ft42"
      >
        and authorities to execute and deliver this Agreement; 
      </p>
      <p
        style="position: absolute; top: 478px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        d.&#160;The Facility Provider has the right to enter &#160;into &#160;and &#160;fully &#160;comply &#160;with, &#160;perform &#160;and 
      </p>
      <p
        style="position: absolute; top: 499px; left: 162px; white-space: nowrap"
        class="ft46"
      >
        observe all its obligations &#160;under &#160;this &#160;Agreement &#160;and &#160;such &#160;compliance, &#160;performance, <br />observation &#160;of &#160;its &#160;obligations &#160;shall &#160;not &#160;violate &#160;or &#160;conflict &#160;with &#160;any &#160;agreement, <br />contract, arrangement and understanding or any instrument, to which is a party or by <br />which it is bound; and 
      </p>
      <p
        style="position: absolute; top: 585px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        e.&#160;The &#160;Facility &#160;Provider &#160;complies &#160;with &#160;all &#160;applicable &#160;Laws &#160;which &#160;are &#160;directly &#160;or 
      </p>
      <p
        style="position: absolute; top: 606px; left: 162px; white-space: nowrap"
        class="ft46"
      >
        indirectly applicable to it for the time being in force, at all times &#160;during &#160;the &#160;Term &#160;of <br />this Agreement. 
      </p>
      <p
        style="position: absolute; top: 649px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        f.&#160;The Facility Provider confirms and declares that there are no action, suit, proceedings, 
      </p>
      <p
        style="position: absolute; top: 670px; left: 162px; white-space: nowrap"
        class="ft46"
      >
        claims, arbitration, inquiry or investigation pending against it, its activities, properties <br />or &#160;assets &#160;or &#160;no &#160;proceedings &#160;for &#160;its &#160;winding &#160;up/insolvency/bankruptcy &#160;have &#160;been <br />instituted against it.  
      </p>
      <p
        style="position: absolute; top: 734px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        g.&#160;The &#160;Facility &#160;Provider &#160;acknowledges  &#160;that &#160;the &#160;relationship &#160;between &#160;the &#160;Parties &#160;under 
      </p>
      <p
        style="position: absolute; top: 756px; left: 162px; white-space: nowrap"
        class="ft46"
      >
        this &#160;Agreement &#160;is &#160;contractual &#160;in &#160;nature, &#160;and &#160;nothing &#160;in &#160;this &#160;Agreement &#160;creates &#160;or <br />intends &#160;to &#160;create &#160;any &#160;partnership, &#160;joint &#160;venture, &#160;agency, &#160;franchise, &#160;or &#160;employment <br />relationship &#160;between &#160;the &#160;Parties. &#160;The &#160;Facility &#160;Provider &#160;shall &#160;have &#160;no &#160;authority &#160;to <br />make or accept any offers or representations on behalf of the Company, unless express <br />Communication is made by the Company. 
      </p>
      <p
        style="position: absolute; top: 863px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        h.&#160;Nothing expressed or mentioned in or implied from this Agreement is intended or will 
      </p>
      <p
        style="position: absolute; top: 884px; left: 162px; white-space: nowrap"
        class="ft46"
      >
        be construed to give to any person other than the Parties to this Agreement any legal <br />or &#160;equitable &#160;right, &#160;remedy, &#160;or &#160;claim &#160;under &#160;or &#160;in &#160;respect &#160;to &#160;this &#160;Agreement. &#160;This <br />Agreement &#160;and &#160;all &#160;of &#160;the &#160;representations, &#160;warranties, &#160;covenants, &#160;conditions, &#160;and <br />provisions &#160;in &#160;this &#160;Agreement &#160;are &#160;intended &#160;to &#160;be &#160;and &#160;are &#160;for &#160;the &#160;sole &#160;and &#160;exclusive <br />benefits of the Parties. 
      </p>
      <p
        style="position: absolute; top: 991px; left: 135px; white-space: nowrap"
        class="ft42"
      >
        i.&#160;Any configuration or set up of the devices for gaining access to the Platform shall be 
      </p>
      <p
        style="
          position: absolute;
          top: 1012px;
          left: 162px;
          white-space: nowrap;
        "
        class="ft46"
      >
        the Facility Provider’s sole responsibility. The Facility Provider &#160;is &#160;solely &#160;responsible <br />to &#160;keep &#160;its &#160;login &#160;credentials &#160;and &#160;accessibility &#160;to &#160;its &#160;profile/account &#160;in &#160;the &#160;Platform, <br />including but not limited to &#160;the &#160;e-mail &#160;id, &#160;passwords, &#160;access &#160;to &#160;devices &#160;etc., &#160;secure; <br />The &#160;Facility &#160;Provider &#160;shall &#160;immediately &#160;notify &#160;the &#160;Company &#160;of &#160;any &#160;actual &#160;or <br />suspected &#160;or &#160;unauthorised &#160;use &#160;or &#160;access &#160;of &#160;its &#160;profile/account &#160;by &#160;any &#160;other &#160;User, <br />facility provider or any third parties. 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft40"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      <!--
      	p {margin: 0; padding: 0;}	.ft50{font-size:16px;font-family:AAAAAA+Carlito;color:#000000;}
      	.ft51{font-size:17px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft52{font-size:17px;font-family:CAAAAA+LiberationSerif;color:#000000;}
      	.ft53{font-size:17px;line-height:21px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      -->
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page5-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft50"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 135px; white-space: nowrap"
        class="ft51"
      >
        j.&#160;The &#160;Facility &#160;Provider &#160;shall &#160;promptly &#160;notify &#160;the &#160;Company, &#160;in &#160;case &#160;of &#160;its &#160;failure &#160;to 
      </p>
      <p
        style="position: absolute; top: 129px; left: 162px; white-space: nowrap"
        class="ft53"
      >
        comply &#160;with &#160;the &#160;above &#160;representations &#160;and &#160;warranties &#160;any &#160;time, &#160;during &#160;the <br />subsistence &#160;of &#160;this &#160;Agreement, &#160;and &#160;acknowledges &#160;that &#160;the &#160;non-compliance &#160;of &#160;the  <br />above representations and warranties may lead to termination &#160;of &#160;this &#160;Agreement &#160;and <br />forfeiture of payments due and payable to it under this Agreement. <br /> 
      </p>
      <p
        style="position: absolute; top: 254px; left: 108px; white-space: nowrap"
        class="ft52"
      >
        <b>5. RIGHTS AND OBLIGATIONS OF THE FACILITY PROVIDER:  </b>
      </p>
      <p
        style="position: absolute; top: 290px; left: 108px; white-space: nowrap"
        class="ft53"
      >
         <br />a.The Facility Provider may sign up in the Platform for the purpose of accessing the contents <br />of the Platform and list its Facilities in the Platform for renting them to the Users. <br /> <br />b.The Facility Provider shall only provide true and accurate &#160;information &#160;to &#160;the &#160;Company &#160;as <br />well as in the Platform, to enable Users to make informed purchase of the Facilities listed in <br />the Platform and for the Company to provide services to its Users efficiently. The signing up <br />and any further changes or modifications in the information provided by the Facility Provider <br />in the Platform shall be updated in the Platform, subject to approval by the Company. <br /> <br />c.The Facility Provider shall <br />i. &#160;possess &#160;professional &#160;ability &#160;and/or &#160;qualification &#160;in &#160;fulfilling &#160;the &#160;timely &#160;provision &#160;of <br />appropriate and quality Facilities to the User; <br />ii. provide right/relevant/appropriate Facilities for rent to the Users; <br />iii. Ensure and maintain the quality of Facilities rented to the Users to the industry standards <br />and solely undertake any ensuing liability therein;  <br />iv. Abstain from inaction, omission, delay, negligence or misrepresentation &#160;in &#160;respect &#160;of &#160;the <br />Facilities; and  <br />v. &#160;Undertake &#160;liability &#160;towards &#160;any &#160;issues &#160;or &#160;concerns &#160;or &#160;problems &#160;arising &#160;in &#160;or &#160;outside &#160;the <br />Platform relating to any of the Facilities provided to the Users including but not limited to the <br />matters listed under this clause above, and shall rectify the same promptly upon issuing prior <br />notice to the Company;  <br /> <br />The Facility Provider acknowledges that the Company shall not be held liable for any of the <br />above-listed &#160;circumstances &#160;and &#160;the &#160;Facility &#160;Provider &#160;hereby &#160;undertakes &#160;to &#160;indemnify &#160;the <br />Company &#160;through &#160;monetary &#160;and &#160;other &#160;means, &#160;against &#160;any &#160;consequential &#160;loss &#160;or &#160;damage, <br />whether direct or indirect, resulting from the above issues, problems or concerns.  <br /> <br />d.The Facility Provider shall access, operate and utilise the Platform &#160;in &#160;accordance &#160;with &#160;the <br />instructions and functionalities permitted in the Platform. The Facility Provider shall provide <br />adequate cooperation and coordinate with the Company for providing its services efficiently.  <br /> <br />e.The Facility Provider shall not act against the interests of the Company, during and after the <br />termination of this Agreement. <br /> <br />f.&#160;The Facility Provider acknowledges that the contents and functionalities of the Platform are <br />owned by the Company and may be modified or updated by the Company any time, without <br />notice &#160;to &#160;the &#160;Facility &#160;Provider. &#160;However, &#160;the &#160;Facility &#160;Provider &#160;acknowledges &#160;that &#160;the <br />Company shall not be liable at any time, for any comments or &#160;feedback &#160;or &#160;ratings &#160;given &#160;by 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft50"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      <!--
      	p {margin: 0; padding: 0;}	.ft60{font-size:16px;font-family:AAAAAA+Carlito;color:#000000;}
      	.ft61{font-size:17px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft62{font-size:17px;line-height:21px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      -->
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page6-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft60"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft62"
      >
        any &#160;of &#160;the &#160;Users &#160;in &#160;relation &#160;to &#160;the &#160;Facilities &#160;listed &#160;by &#160;the &#160;Facility &#160;Provider.The &#160;Facility <br />Provider shall not use the Platform in a manner (i) that is prohibited by &#160;applicable &#160;Laws, &#160;or <br />facilitates &#160;the &#160;violation &#160;of &#160;Laws; &#160;or &#160;(ii) &#160;that &#160;shall &#160;disrupt &#160;any &#160;other &#160;facility &#160;provider’s &#160;or <br />User’s &#160;usage &#160;of &#160;Platform &#160;(iii) &#160;that &#160;violates &#160;or &#160;tampers &#160;or &#160;reasonably &#160;appears &#160;to &#160;violate &#160;or <br />tamper with the programmed functioning and security of the Platform; <br /> <br />g.The &#160;Facility &#160;Provider &#160;agrees &#160;and &#160;acknowledges &#160;that &#160;the &#160;Company &#160;does &#160;not &#160;and &#160;cannot <br />review every posting made on the Platform. These Conditions do not require the Platform to <br />monitor, police or remove any postings or other information submitted &#160;by &#160;any &#160;other &#160;facility <br />provider or User, and the Company shall not be responsible for any ensuing liability. <br /> <br />h.The &#160;Facility &#160;Provider &#160;is &#160;prohibited &#160;from &#160;endorsing, &#160;publishing, &#160;soliciting, &#160;promoting, <br />sharing, &#160;distributing, &#160;transmitting &#160;any &#160;posts, &#160;hyperlinks, &#160;invitations, &#160;offers, &#160;in &#160;any &#160;form, <br />whether directly or indirectly, to the Users or other facility providers or for any other purpose, <br />in &#160;the &#160;Platform &#160;or &#160;out &#160;of &#160;the &#160;Platform, &#160;including &#160;but &#160;not &#160;limited &#160;to &#160;any &#160;unsolicited <br />communications, &#160;messages, &#160;communications &#160;pertaining &#160;to &#160;unlawful &#160;or &#160;illegal &#160;activities, <br />communications &#160;in &#160;the &#160;nature &#160;of &#160;solicitation &#160;or &#160;promotions, &#160;information &#160;for &#160;the &#160;purpose &#160;of <br />collecting or disseminating information from/amongst the Users &#160;or &#160;facility &#160;providers &#160;or &#160;any <br />third parties etc.  <br /> <br />i.&#160;The Company may seek for the production of any relevant document relating to the Facility <br />Provider’s &#160;Facilities &#160;and &#160;such &#160;other &#160;documents &#160;as &#160;may &#160;be &#160;required &#160;to &#160;validate &#160;Facility <br />Provider’s &#160;eligibility &#160;to &#160;offer &#160;the &#160;Facilities. &#160;Facility &#160;Provider &#160;hereby &#160;consents &#160;to &#160;undergo &#160;a <br />manual KYC verification process at any time before or after the execution of this Agreement. <br /> <br />j.&#160;The Facility Provider acknowledges that it has read and agrees to the Company’s Policies. <br /> <br />k.The &#160;Facility &#160;Provider &#160;shall &#160;ensure &#160;that &#160;all &#160;Facilities &#160;offered &#160;through &#160;CUMMA’s &#160;Platform <br />strictly adhere to comply with all applicable local, state, and national Laws, including but not <br />limited &#160;to &#160;safety &#160;regulations, &#160;licensing &#160;requirements, &#160;and &#160;industry &#160;standards.&#160;&#160;The &#160;Facility <br />Provider &#160;shall &#160;possess &#160;all &#160;the &#160;required &#160;approvals, &#160;licences &#160;and &#160;certifications, &#160;and &#160;shall &#160;be <br />solely &#160;liable &#160;for &#160;any &#160;penalties, &#160;claims, &#160;or &#160;legal &#160;consequences &#160;arising &#160;from &#160;such &#160;non-<br />compliance to the Users and/or any third parties including the statutory authorities. <br /> <br />l. The Facility Provider shall maintain the &#160;Facilities &#160;including &#160;the &#160;Products &#160;in &#160;a &#160;clean, &#160;safe, <br />well-maintained &#160;and &#160;operating &#160;condition, &#160;ensuring &#160;that &#160;the &#160;Users &#160;shall &#160;avail &#160;and &#160;utilise &#160;the <br />Facilities &#160;as &#160;described &#160;at &#160;the &#160;time &#160;of &#160;booking &#160;in &#160;the &#160;Platform. &#160;The &#160;Facility &#160;Provider &#160;shall <br />ensure that the Products listed and/or leased to the Users are procured from legitimate source <br />and &#160;appropriate &#160;brands &#160;with &#160;necessary &#160;licences, &#160;certifications, &#160;invoices &#160;etc., &#160;evidencing <br />lawful &#160;purchase &#160;and &#160;eligibility &#160;for &#160;usage &#160;of &#160;the &#160;same. &#160;Routine &#160;inspection, &#160;repair, &#160;and <br />maintenance of the Facilities shall be the responsibility of the Facility Provider. Any service <br />disruptions &#160;or &#160;temporary &#160;unavailability &#160;must &#160;be &#160;promptly &#160;updated &#160;on &#160;CUMMA’s &#160;Platform <br />and &#160;to &#160;the &#160;Company. &#160;The &#160;Facility &#160;Provider &#160;shall &#160;immediately &#160;address &#160;and &#160;rectify &#160;any <br />complaints &#160;or &#160;service &#160;issues &#160;raised &#160;by &#160;Users &#160;or &#160;the &#160;Company &#160;regarding &#160;the &#160;condition &#160;or <br />functionality of the facilities. <br /> <br />m. &#160; &#160;The &#160;Facility &#160;Provider &#160;may &#160;inspect &#160;the &#160;facility &#160;or &#160;equipment &#160;during &#160;the &#160;booking &#160;period <br />only for legitimate purposes, such as ensuring compliance with usage terms, verify damages, 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft60"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      <!--
      	p {margin: 0; padding: 0;}	.ft70{font-size:16px;font-family:AAAAAA+Carlito;color:#000000;}
      	.ft71{font-size:17px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft72{font-size:17px;font-family:CAAAAA+LiberationSerif;color:#000000;}
      	.ft73{font-size:17px;line-height:21px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      -->
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page7-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft70"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft73"
      >
        or address any reported issues.  Any inspection shall be conducted in a &#160;professional &#160;manner <br />and &#160;shall &#160;not &#160;unreasonably &#160;interfere &#160;with &#160;the &#160;User’s &#160;lawful &#160;enjoyment &#160;of &#160;the &#160;service. <br />Company &#160;reserves &#160;the &#160;right &#160;to &#160;conduct &#160;independent &#160;inspections &#160;to &#160;assess &#160;service &#160;quality, <br />verify &#160;complaints, &#160;ensure &#160;adherence &#160;to &#160;agreed-upon &#160;service &#160;standards &#160;or &#160;for &#160;such &#160;other <br />reasons at the discretion of the Company. <br /> <br />n. The Facility Provider shall not impose any additional charges &#160;such &#160;as &#160;damages, &#160;extended <br />usage fees, penalties, or extra services without prior notice and approval of the Company. The <br />Facility &#160;Provider &#160;shall &#160;not, &#160;under &#160;any &#160;circumstances, &#160;accept &#160;direct &#160;payments &#160;from &#160;Users <br />without Company’s explicit written authorization. In case of any disputes, non-compliance, or <br />User &#160;complaints, &#160;Company &#160;reserves &#160;the &#160;right &#160;to &#160;temporarily &#160;withhold &#160;or &#160;adjust &#160;payments <br />until the issue is resolved. <br /> <br />o. The Facility Provider shall take full liability for any property &#160;damage, &#160;personal &#160;injury, &#160;or <br />financial &#160;loss &#160;or &#160;accidents &#160;occurring &#160;within &#160;its &#160;premises &#160;due &#160;to &#160;negligence, &#160;lack &#160;of <br />maintenance, or non- compliance with safety norms and for such other reasons attributable to <br />the &#160;Facility &#160;Provider. &#160;In &#160;case &#160;of &#160;any &#160;such &#160;defaults &#160;attributable &#160;to &#160;the &#160;Users, &#160;the &#160;Facility <br />Provider &#160;shall &#160;raise &#160;a &#160;claim &#160;only &#160;against &#160;the &#160;User &#160;upon &#160;prior &#160;notice &#160;to &#160;the &#160;Company. &#160;The <br />Company shall not be held liable for any such defaults including but not limited &#160;to &#160;damage, <br />personal injury, legal claims, or financial loss &#160;arising &#160;from &#160;the &#160;Facility &#160;Provider’s &#160;failure &#160;to <br />uphold the required service and safety standards. <br /> <br />p. &#160;The &#160;Facility &#160;Provider &#160;shall &#160;strictly &#160;adhere &#160;to &#160;all &#160;operational, &#160;security, &#160;and &#160;compliance <br />policies &#160;set &#160;by &#160;the &#160;Company &#160;and &#160;statutory &#160;authorities. &#160;The &#160;Facility &#160;Provider &#160;acknowledges <br />that &#160;the &#160;Facility &#160;Provider &#160;shall &#160;be &#160;bound &#160;by &#160;the &#160;Company’s &#160;Policies &#160;all &#160;times, &#160;during <br />subsistence of its relationship with the Company as well as for such period or at all times, as <br />the Company’s Policies mandate. <br /> <br />q. Any unauthorized use or attempt to malign the functionality of the Company’s Platform or <br />engage in any fraudulent, deceptive, or unauthorized activities shall be considered a material <br />breach of this Agreement. This includes listing the same Facilities at a lower price outside the <br />Platform, deficiency in providing services in respect of the Facilities, soliciting the &#160;Users &#160;or <br />other &#160;facility &#160;providers &#160;or &#160;affiliates &#160;or &#160;any &#160;third &#160;parties &#160;to &#160;act &#160;against &#160;the &#160;interests &#160;of &#160;the <br />Company or to alter their relationship with the Company, competing &#160;activities &#160;etc., &#160;entitling <br />the &#160;Company &#160;to &#160;impose &#160;penalties, &#160;withhold &#160;payments, &#160;terminate &#160;this &#160;Agreement, &#160;to &#160;take <br />appropriate legal action, and such other rights and remedies at the discretion of the Company.  <br /> <br />r. The Facility Provider shall maintain books of accounts and records of the Facilities availed <br />by the Company or the User, and shall produce the same to the Company promptly at its own <br />cost &#160;and &#160;expenses &#160;for &#160;audit, &#160;inspection &#160;and &#160;such &#160;other &#160;activities &#160;as &#160;determined &#160;by &#160;the <br />Company. <br /> <br /> <br /><b
          >6. PAYMENTS   </b
        >
      </p>
      <p
        style="
          position: absolute;
          top: 1066px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft73"
      >
        a. &#160;The &#160;Facility &#160;Provider &#160;shall &#160;receive &#160;payments &#160;from &#160;the &#160;Users &#160;exclusively &#160;through &#160;the <br />Platform &#160;and/or &#160;the &#160;designated &#160;bank &#160;account &#160;maintained &#160;and &#160;owned &#160;by &#160;the &#160;Company &#160;as <br />mentioned hereunder, towards the bookings made by Users through the Company’s Platform. 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft70"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      <!--
      	p {margin: 0; padding: 0;}	.ft80{font-size:16px;font-family:AAAAAA+Carlito;color:#000000;}
      	.ft81{font-size:17px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft82{font-size:11px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft83{font-size:17px;line-height:20px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      	.ft84{font-size:17px;line-height:21px;font-family:BAAAAA+LiberationSerif;color:#000000;}
      -->
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page8-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft80"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 109px; left: 108px; white-space: nowrap"
        class="ft83"
      >
        The Facility Provider shall raise invoices before 10th day of every month against the Facilities <br />availed and utilised by the Users in the previous month.  
      </p>
      <p
        style="position: absolute; top: 168px; left: 108px; white-space: nowrap"
        class="ft84"
      >
        b. The Company shall charge a commission of 7-10% on the the payments received from the <br />New User of every successful transaction made through the Platform, excluding tax and other <br />charges. &#160;After &#160;deducting &#160;the &#160;applicable &#160;commission &#160;from &#160;the &#160;payment &#160;received, &#160;the <br />remaining &#160;amount &#160;from &#160;the &#160;payment &#160;made &#160;by &#160;the &#160;User &#160;for &#160;the &#160;Facilities &#160;availed &#160;will &#160;be <br />credited &#160;in &#160;the &#160;Facility &#160;Provider’s &#160;designated &#160;bank &#160;account &#160;under &#160;the &#160;terms &#160;and &#160;conditions <br />agreed hereunder.   
      </p>
      <p
        style="position: absolute; top: 315px; left: 108px; white-space: nowrap"
        class="ft84"
      >
        c. &#160;The &#160;Company &#160;shall &#160;process &#160;payments &#160;to &#160;the &#160;Facility &#160;Provider &#160;only &#160;after &#160;receiving &#160;full <br />payment from the &#160;Users &#160;for &#160;the &#160;availed &#160;Facilities. &#160;The &#160;Facility &#160;Provider &#160;acknowledges &#160;that <br />the Company acts solely as an intermediary for processing payments &#160;and &#160;shall &#160;not &#160;be &#160;liable <br />for any delays caused due to bank processing, technical issues, or User’s failure to make any <br />payments. 
      </p>
      <p
        style="position: absolute; top: 440px; left: 108px; white-space: nowrap"
        class="ft84"
      >
        d. The Company shall disburse &#160;the &#160;Facility &#160;Provider’s &#160;payments &#160;within &#160;thirty &#160;(30) &#160;working <br />days from the date &#160;of &#160;receiving &#160;the &#160;invoices &#160;from &#160;the &#160;Facility &#160;Provider &#160;and &#160;upon &#160;receiving <br />payments from the Users. &#160;All &#160;payments &#160;shall &#160;be &#160;credited &#160;directly &#160;to &#160;the &#160;Facility &#160;Provider’s <br />registered bank account as per the details provided in this Agreement. 
      </p>
      <p
        style="position: absolute; top: 543px; left: 108px; white-space: nowrap"
        class="ft84"
      >
        e. &#160;The &#160;Company &#160;reserves &#160;the &#160;right &#160;to &#160;withhold &#160;or &#160;forfeit &#160;any &#160;payments &#160;and/or &#160;to &#160;impose <br />penalities, claim cost and expenditure in case of disputes, violation of this Agreement and/or <br />Company’s Policies by the Facility Provider and for any other reasons as &#160;determined &#160;by &#160;the <br />Company.  
      </p>
      <p
        style="position: absolute; top: 647px; left: 108px; white-space: nowrap"
        class="ft84"
      >
        f.The manner/mode of payment, service charges and commission chargeable by the Company <br />shall be revised at intervals at the discretion of the Company.  
      </p>
      <p
        style="position: absolute; top: 707px; left: 108px; white-space: nowrap"
        class="ft84"
      >
        g. In the event of a refund request from an User due to issues pertaining to the quality of the <br />Facilities &#160;Provided, &#160;cancellation &#160;of &#160;booking, &#160;or &#160;for &#160;any &#160;other &#160;reasons &#160;as &#160;outlined &#160;in &#160;this <br />Agreement and/or in the Company’s Policies, the refund shall be processed as per the Refund <br />Policy &#160;and &#160;as &#160;outlined &#160;in &#160;the &#160;Terms &#160;and &#160;Conditions &#160;of &#160;the &#160;Platform. &#160;The &#160;Facility &#160;Provider <br />acknowledges and agrees that: 
      </p>
      <p
        style="position: absolute; top: 832px; left: 108px; white-space: nowrap"
        class="ft81"
      >
        i) Refund eligibility of an User shall be determined based on the Company’s policies,  
      </p>
      <p
        style="position: absolute; top: 872px; left: 108px; white-space: nowrap"
        class="ft84"
      >
        ii) &#160;If &#160;the &#160;refund &#160;request &#160;is &#160;initiated &#160;by &#160;an &#160;User &#160;due &#160;to &#160;deficiency, &#160;cancellation, &#160;or &#160;non-<br />fulfilment &#160;of &#160;services &#160;by &#160;the &#160;Facility &#160;Provider &#160;or &#160;for &#160;such &#160;other &#160;reasons &#160;attributable &#160;to <br />negligence, omission, action, inaction, violation of this Agreement, non-compliance of Laws <br />and Company’s Policies by the Facility Provider, the amount refunded/refundable to the User <br />shall be deducted from the payments due to Facility Provider or future payouts to the Facility <br />Provider &#160;or &#160;such &#160;amount &#160;may &#160;be &#160;recovered &#160;separately &#160;from &#160;the &#160;Facility &#160;Provider &#160;at &#160;the <br />discretion of the Company,  
      </p>
      <p
        style="
          position: absolute;
          top: 1039px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft84"
      >
        iii) &#160;The &#160;Company &#160;reserves &#160;the &#160;right &#160;to &#160;mediate &#160;disputes &#160;and &#160;decide &#160;on &#160;refunds &#160;at &#160;its &#160;sole <br />discretion, and such decisions shall be binding on the Facility Provider. 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft80"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      p {
        margin: 0;
        padding: 0;
      }
      .ft90 {
        font-size: 16px;
        font-family: AAAAAA + Carlito;
        color: #000000;
      }
      .ft91 {
        font-size: 17px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft92 {
        font-size: 17px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft93 {
        font-size: 17px;
        line-height: 21px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft94 {
        font-size: 17px;
        line-height: 24px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page9-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft90"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft93"
      >
        h. The Facility Provider shall not process any grievance or commit to refunds independently <br />outside &#160;of &#160;the &#160;Platform’s &#160;payment &#160;system, &#160;unless &#160;expressly &#160;authorized &#160;by &#160;the &#160;Company &#160;in <br />writing. 
      </p>
      <p
        style="position: absolute; top: 190px; left: 108px; white-space: nowrap"
        class="ft93"
      >
        i. Any payment due under this Agreement shall be transferred electronically to the respective <br />Party’s bank account as mentioned in their respective profile. If either Party intends to change <br />its bank account details provided above, it shall provide prior written notice to the other Party <br />along with updated bank details. Until such changes are formally acknowledged in writing by <br />the receiving &#160;Party, &#160;all &#160;payments &#160;shall &#160;continue &#160;to &#160;be &#160;processed &#160;to &#160;the &#160;previously &#160;provided <br />account. 
      </p>
      <p
        style="position: absolute; top: 336px; left: 108px; white-space: nowrap"
        class="ft91"
      >
         
      </p>
      <p
        style="position: absolute; top: 375px; left: 108px; white-space: nowrap"
        class="ft92"
      >
        <b>7. TERMINATION: </b>
      </p>
      <p
        style="position: absolute; top: 418px; left: 135px; white-space: nowrap"
        class="ft91"
      >
        a.&#160;In &#160;the &#160;event &#160;that &#160;the &#160;Facility &#160;Provider &#160;fails &#160;to &#160;adhere &#160;to &#160;its &#160;obligations &#160;under &#160;this 
      </p>
      <p
        style="position: absolute; top: 443px; left: 162px; white-space: nowrap"
        class="ft94"
      >
        Agreement, &#160;including &#160;but &#160;not &#160;limited &#160;to &#160;non-availability &#160;of &#160;the &#160;Facility &#160;as &#160;per <br />confirmed &#160;bookings, &#160;delay &#160;or &#160;failure &#160;in &#160;making &#160;the &#160;facility &#160;available &#160;for &#160;Users; <br />providing &#160;defective, &#160;unsafe, &#160;or &#160;substandard &#160;Facilities; &#160;repeated &#160;complaints &#160;from &#160;the <br />Users against the Facilities and/or Facility Provider; breach of this Agreement and/or <br />Company’s &#160;Policies &#160;by &#160;the &#160;Facility &#160;Provider; &#160;Facility &#160;Provider’s &#160;ineligibility &#160;to &#160;use <br />the Platform etc., the Company shall be at liberty to terminate this Agreement without <br />any prior notice to the Facility Provider.  
      </p>
      <p
        style="position: absolute; top: 634px; left: 135px; white-space: nowrap"
        class="ft91"
      >
        b.&#160;The &#160;Company &#160;may &#160;terminate &#160;this &#160;Agreement &#160;for &#160;any &#160;other &#160;reasons &#160;by &#160;issuing &#160;30 
      </p>
      <p
        style="position: absolute; top: 659px; left: 162px; white-space: nowrap"
        class="ft91"
      >
        days’ prior notice in writing. 
      </p>
      <p
        style="position: absolute; top: 702px; left: 135px; white-space: nowrap"
        class="ft91"
      >
        c.&#160;If &#160;the &#160;Facility &#160;Provider &#160;wishes &#160;to &#160;terminate &#160;this &#160;Agreement &#160;for &#160;any &#160;reason, &#160;it &#160;must 
      </p>
      <p
        style="position: absolute; top: 726px; left: 162px; white-space: nowrap"
        class="ft94"
      >
        provide the Company with at least sixty (60) days’ prior &#160;written &#160;notice. &#160;The &#160;Facility <br />Provider shall ensure that all ongoing bookings are honored during this notice period, <br />failing &#160;which &#160;the &#160;Company &#160;reserves &#160;the &#160;right &#160;to &#160;deduct &#160;cost &#160;and &#160;expenses &#160;from <br />payments due or future payouts to be made to the Facility Provider or claim the &#160;cost <br />and &#160;expenses &#160;separately &#160;from &#160;the &#160;Facility &#160;Provider, &#160;owing &#160;to &#160;any &#160;claims, &#160;refunds, <br />penalties etc., raised by the Users and/or any third parties. 
      </p>
      <p
        style="position: absolute; top: 893px; left: 135px; white-space: nowrap"
        class="ft91"
      >
        d.&#160;The &#160;Facility &#160;Provider &#160;shall &#160;not &#160;be &#160;entitled &#160;to &#160;claim &#160;any &#160;additional &#160;compensation, 
      </p>
      <p
        style="position: absolute; top: 918px; left: 162px; white-space: nowrap"
        class="ft91"
      >
        damages, or goodwill payment upon termination. 
      </p>
      <p
        style="position: absolute; top: 960px; left: 135px; white-space: nowrap"
        class="ft91"
      >
        e.&#160;<b>Post-Termination Obligations: </b>
      </p>
      <p
        style="
          position: absolute;
          top: 1003px;
          left: 165px;
          white-space: nowrap;
        "
        class="ft91"
      >
        i.
      </p>
      <p
        style="
          position: absolute;
          top: 1003px;
          left: 207px;
          white-space: nowrap;
        "
        class="ft94"
      >
        The &#160;Facility &#160;Provider &#160;shall &#160;immediately &#160;cease &#160;using &#160;the &#160;Company’s &#160;Platform, <br />branding, or any materials associated with and/or belongs to CUMMA. 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft90"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      p {
        margin: 0;
        padding: 0;
      }
      .ft100 {
        font-size: 16px;
        font-family: AAAAAA + Carlito;
        color: #000000;
      }
      .ft101 {
        font-size: 17px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft102 {
        font-size: 17px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft103 {
        font-size: 17px;
        line-height: 24px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft104 {
        font-size: 17px;
        line-height: 21px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page10-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft100"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 160px; white-space: nowrap"
        class="ft101"
      >
        ii.
      </p>
      <p
        style="position: absolute; top: 108px; left: 207px; white-space: nowrap"
        class="ft103"
      >
        Any pending disputes related to payments or User complaints shall continue to <br />be &#160;resolved &#160;by &#160;the &#160;Company &#160;as &#160;per &#160;the &#160;terms &#160;of &#160;this &#160;Agreement, &#160;even &#160;after <br />termination of this Agreement. 
      </p>
      <p
        style="position: absolute; top: 200px; left: 155px; white-space: nowrap"
        class="ft101"
      >
        iii.
      </p>
      <p
        style="position: absolute; top: 200px; left: 207px; white-space: nowrap"
        class="ft103"
      >
        The &#160;Facility &#160;Provider &#160;shall &#160;strictly &#160;adhere &#160;to &#160;the &#160;confidentiality &#160;obligations <br />under this Agreement. 
      </p>
      <p
        style="position: absolute; top: 267px; left: 108px; white-space: nowrap"
        class="ft104"
      >
         <br /><b>8. DISCLAIMER: </b>
      </p>
      <p
        style="position: absolute; top: 325px; left: 108px; white-space: nowrap"
        class="ft104"
      >
        a. The Company provides the Platform and related services on &#160;an &#160;&#34;as-is&#34; &#160;and &#160;&#34;as &#160;available&#34; <br />basis. The Company makes no representations or warranties of any kind, express or implied, <br />regarding the operation, accuracy, reliability or suitability of the Platform or the suitability of <br />the services offered.  <br />b. &#160;The &#160;Facility &#160;Provider &#160;acknowledges &#160;that &#160;the &#160;Company &#160;shall &#160;not &#160;be &#160;responsible &#160;for &#160;any <br />direct, indirect, incidental, or consequential damages arising from the use of the &#160;Platform &#160;or <br />any &#160;promotional &#160;services &#160;or &#160;any &#160;issues &#160;related &#160;to &#160;product/service &#160;listing, &#160;transactions &#160;or <br />User/third-party actions.  <br />c. The Facility Provider acknowledges that the Company is only an intermediary &#160;facilitating <br />transaction &#160;between &#160;Users &#160;and &#160;Facility &#160;Providers &#160;and &#160;the &#160;Company &#160;does &#160;not &#160;provide &#160;any <br />guarantee regarding the number of bookings, revenue, or demand for the &#160;Facility &#160;Provider’s <br />services. <br />d. &#160;The &#160;Facility &#160;Provider &#160;shall &#160;not &#160;be &#160;responsible &#160;in &#160;any &#160;manner &#160;for &#160;the &#160;authenticity &#160;of &#160;the <br />personal &#160;information &#160;or &#160;sensitive &#160;personal &#160;data &#160;or &#160;information &#160;supplied &#160;by &#160;the &#160;User &#160;or &#160;the <br />Company or any other third parties.  <br />e.Notwithstanding &#160;anything &#160;contained &#160;elsewhere &#160;in &#160;these &#160;Conditions, &#160;in &#160;no &#160;event &#160;shall &#160;the <br />Company or any of &#160;its &#160;directors, &#160;officers, &#160;employees, &#160;technicians, &#160;agents &#160;or &#160;content/service <br />providers be liable to the Facility Provider or anyone claiming under Facility Provider for any <br />costs or loss incurred or suffered &#160;or &#160;anyone &#160;claiming &#160;under &#160;Facility &#160;Provider, &#160;including &#160;but <br />not limited to any special, exemplary, consequential, incidental, punitive or indirect damages <br />on any theory of liability, whether in contract, tort (including without limitation negligence), <br />strict liability, liability arising in relation to and out of the operations of Application, contents <br />posted, transmitted, exchanged or received or violation of any Intellectual Property Rights or <br />any &#160;of &#160;the &#160;Users’ &#160;activities, &#160;negligence, &#160;inaction &#160;or &#160;omission &#160;or &#160;violation &#160;of &#160;Laws &#160;or <br />otherwise. &#160;In &#160;no &#160;event &#160;or &#160;circumstance &#160;shall &#160;the &#160;Company &#160;be &#160;under &#160;any &#160;liability &#160;to &#160;make <br />good any loss whether by way of any monetary payment or otherwise. <br /> <br /><b
          >9. INTELLECTUAL PROPERTY RIGHTS</b
        >&#160;
      </p>
      <p
        style="position: absolute; top: 935px; left: 108px; white-space: nowrap"
        class="ft103"
      >
         <br />a.The &#160;Facility &#160;Provider &#160;hereby &#160;grants &#160;the &#160;Company &#160;a &#160;limited, &#160;non-exclusive, &#160;non-<br />transferable, &#160;right &#160;to &#160;use &#160;the &#160;Facility &#160;Provider’s &#160;trademarks, &#160;trade &#160;names, &#160;and &#160;other <br />Intellectual &#160;Property &#160;Rights &#160;for &#160;the &#160;purpose &#160;of &#160;marketing, &#160;distributing, &#160;and &#160;promoting &#160;the <br />Facility Provider’s services on the CUMMA Platform, during the term of this Agreement.  <br /> <br />b.The Facility Provider shall not use, modify, distribute, or reproduce any of &#160;the &#160;Company's <br />trademarks, brand elements, proprietary materials, or content without prior written consent of 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft100"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      p {
        margin: 0;
        padding: 0;
      }
      .ft110 {
        font-size: 16px;
        font-family: AAAAAA + Carlito;
        color: #000000;
      }
      .ft111 {
        font-size: 17px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft112 {
        font-size: 16px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft113 {
        font-size: 17px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft114 {
        font-size: 14px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft115 {
        font-size: 17px;
        line-height: 24px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft116 {
        font-size: 17px;
        line-height: 21px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft117 {
        font-size: 17px;
        line-height: 21px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page11-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft110"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft115"
      >
        the Company. Any unauthorized use of the Company's Intellectual Property shall be deemed <br />a material breach of this Agreement. 
      </p>
      <p
        style="position: absolute; top: 157px; left: 162px; white-space: nowrap"
        class="ft112"
      >
         
      </p>
      <p
        style="position: absolute; top: 191px; left: 108px; white-space: nowrap"
        class="ft116"
      >
        c.The Facility Provider represents and warrants that it holds valid and enforceable Intellectual <br />Property Rights used in connection with the Facilities offered. The Facility Provider shall be <br />solely &#160;responsible &#160;for &#160;obtaining &#160;and &#160;maintaining &#160;all &#160;necessary &#160;licenses, &#160;approvals, &#160;or <br />certifications &#160;required &#160;for &#160;the &#160;use &#160;of &#160;such &#160;Intellectual &#160;Property &#160;Rights &#160;and &#160;shall &#160;keep &#160;the <br />Company &#160;indemnified &#160;by &#160;all &#160;means &#160;against &#160;any &#160;claims &#160;relating &#160;to &#160;the &#160;Intellectual &#160;Property <br />Rights of the Facility Provider. <br /> <br /> <br /><b
          >10. CONFIDENTIAL INFORMATION  <br /></b
        > <br /> 
      </p>
      <p
        style="position: absolute; top: 448px; left: 135px; white-space: nowrap"
        class="ft112"
      >
        a.
      </p>
      <p
        style="position: absolute; top: 446px; left: 162px; white-space: nowrap"
        class="ft116"
      >
        The Parties acknowledge that during the course of this Agreement, the Company may <br />share or the Facility Provider may gain access to Confidential Information belonging <br />to &#160;the &#160;Company. &#160;The &#160;Facility &#160;Provider &#160;agrees &#160;to &#160;keep &#160;such &#160;information &#160;strictly <br />confidential and not to disclose it to any third party and/or utilise the same for its own <br />benefits &#160;or &#160;benefits &#160;to &#160;third &#160;parties, &#160;whether &#160;directly &#160;or &#160;indirectly, &#160;without &#160;prior <br />written consent of the Company.  
      </p>
      <p
        style="position: absolute; top: 576px; left: 135px; white-space: nowrap"
        class="ft112"
      >
        b.
      </p>
      <p
        style="position: absolute; top: 575px; left: 162px; white-space: nowrap"
        class="ft116"
      >
        Notwithstanding &#160;anything &#160;in &#160;the &#160;foregoing &#160;to &#160;the &#160;contrary, &#160;Facility &#160;Provider &#160;may <br />disclose &#160;Confidential &#160;Information &#160;pursuant &#160;to &#160;any &#160;governmental, &#160;judicial, &#160;or <br />administrative &#160;order, &#160;provided &#160;that &#160;the &#160;Facility &#160;Provider &#160;promptly &#160;notifies, &#160;to &#160;the <br />extent practicable, the Company in writing of such demand for disclosure so that &#160;the <br />Facility Provider, at its sole expense, may seek &#160;to &#160;make &#160;such &#160;disclosure &#160;subject &#160;to &#160;a <br />protective &#160;order &#160;or &#160;other &#160;appropriate &#160;remedy &#160;to &#160;preserve &#160;the &#160;confidentiality &#160;of &#160;the <br />Confidential Information; provided that the Facility &#160;Provider &#160;shall &#160;disclose &#160;only &#160;that <br />portion of the requested Confidential Information that it is required to disclose.  
      </p>
      <p
        style="position: absolute; top: 747px; left: 135px; white-space: nowrap"
        class="ft112"
      >
        c.
      </p>
      <p
        style="position: absolute; top: 746px; left: 162px; white-space: nowrap"
        class="ft116"
      >
        The Facility Provider shall return to the Company all Confidential Information of the <br />Company &#160;including &#160;all &#160;copies, &#160;translations, &#160;conversions, &#160;modifications &#160;and <br />derivations thereof, upon termination of this Agreement or as and when demanded by <br />the &#160;Company. &#160;The &#160;Facility &#160;Provider &#160;shall &#160;also &#160;confirm &#160;in &#160;writing, &#160;return &#160;of &#160;all <br />Confidential &#160;Information &#160;as &#160;well &#160;as &#160;any &#160;copies &#160;thereof &#160;to &#160;the &#160;Company &#160;within <br />fourteen (14) days upon receipt of notice of termination or notice of demand.  
      </p>
      <p
        style="position: absolute; top: 875px; left: 135px; white-space: nowrap"
        class="ft112"
      >
        d.
      </p>
      <p
        style="position: absolute; top: 874px; left: 162px; white-space: nowrap"
        class="ft116"
      >
        The obligations of confidentiality shall survive the termination of this Agreement and <br />remain in effect at all times after the termination of this Agreement. 
      </p>
      <p
        style="position: absolute; top: 917px; left: 108px; white-space: nowrap"
        class="ft116"
      >
         <br /> <br /><b>11. INDEMNIFICATION <br /></b
        > <br />a.The &#160;Facility &#160;Provider &#160;agrees &#160;to &#160;indemnify, &#160;defend, &#160;and &#160;hold &#160;harmless &#160;the &#160;Company, &#160;its <br />directors, officers, employees, agents, &#160;and &#160;affiliates &#160;including &#160;other &#160;facility &#160;providers &#160;in &#160;the <br />Platform from and against all claims, losses, liabilities, damages, costs, injuries and expenses <br />(including attorneys’ fees) arising out of: 
      </p>
      <p
        style="
          position: absolute;
          top: 1090px;
          left: 135px;
          white-space: nowrap;
        "
        class="ft114"
      >
        ∙
      </p>
      <p
        style="
          position: absolute;
          top: 1088px;
          left: 162px;
          white-space: nowrap;
        "
        class="ft111"
      >
        The Facility Provider’s use and access to the Platform. 
      </p>
      <p
        style="
          position: absolute;
          top: 1112px;
          left: 135px;
          white-space: nowrap;
        "
        class="ft114"
      >
        ∙
      </p>
      <p
        style="
          position: absolute;
          top: 1109px;
          left: 162px;
          white-space: nowrap;
        "
        class="ft111"
      >
        Any breach of this Agreement by the Facility Provider. 
      </p>
      <p
        style="
          position: absolute;
          top: 1133px;
          left: 135px;
          white-space: nowrap;
        "
        class="ft114"
      >
        ∙
      </p>
      <p
        style="
          position: absolute;
          top: 1130px;
          left: 162px;
          white-space: nowrap;
        "
        class="ft111"
      >
        Any violation of applicable Laws, including tax obligations. 
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft110"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      p {
        margin: 0;
        padding: 0;
      }
      .ft120 {
        font-size: 16px;
        font-family: AAAAAA + Carlito;
        color: #000000;
      }
      .ft121 {
        font-size: 14px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft122 {
        font-size: 17px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft123 {
        font-size: 17px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft124 {
        font-size: 17px;
        line-height: 21px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft125 {
        font-size: 17px;
        line-height: 21px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft126 {
        font-size: 17px;
        line-height: 23px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page12-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft120"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 110px; left: 135px; white-space: nowrap"
        class="ft121"
      >
        ∙
      </p>
      <p
        style="position: absolute; top: 108px; left: 162px; white-space: nowrap"
        class="ft122"
      >
        Violation of Company’s Policies 
      </p>
      <p
        style="position: absolute; top: 132px; left: 135px; white-space: nowrap"
        class="ft121"
      >
        ∙
      </p>
      <p
        style="position: absolute; top: 129px; left: 162px; white-space: nowrap"
        class="ft124"
      >
        Any &#160;claim &#160;related &#160;to &#160;the &#160;Facility &#160;Provider’s &#160;listed &#160;Facilities, &#160;including &#160;product <br />liability claims, false advertising, or regulatory violations etc. 
      </p>
      <p
        style="position: absolute; top: 175px; left: 135px; white-space: nowrap"
        class="ft121"
      >
        ∙
      </p>
      <p
        style="position: absolute; top: 172px; left: 162px; white-space: nowrap"
        class="ft124"
      >
        Any &#160;unauthorized &#160;use &#160;of &#160;the &#160;Confidential &#160;Information &#160;and/or &#160;Intellectual &#160;Property <br />Rights relating to the Company or of any third parties. 
      </p>
      <p
        style="position: absolute; top: 217px; left: 135px; white-space: nowrap"
        class="ft121"
      >
        ∙
      </p>
      <p
        style="position: absolute; top: 215px; left: 162px; white-space: nowrap"
        class="ft124"
      >
        Any negligence, intentional, fraud, or willful misconduct by the Facility Provider, &#160;its <br />officers, employees, agents, subcontractors, Licencees, or invitees etc. 
      </p>
      <p
        style="position: absolute; top: 257px; left: 108px; white-space: nowrap"
        class="ft124"
      >
         <br />b. &#160;Notwithstanding &#160;anything &#160;provided &#160;under &#160;this &#160;Agreement &#160;or &#160;under &#160;Company’s &#160;Policies, <br />Facility Provider agrees that it shall not commence, maintain, initiate, or prosecute, or cause, <br />encourage, &#160;assist, &#160;volunteer, &#160;advise &#160;or &#160;cooperate &#160;with &#160;any &#160;other &#160;person &#160;to &#160;commence, <br />maintain, initiate or prosecute, any action, Lawsuit, proceeding, charge, petition, complaint or <br />claim &#160;before &#160;any &#160;court, &#160;agency &#160;or &#160;tribunal &#160;against &#160;the &#160;matters &#160;or &#160;any &#160;of &#160;the &#160;other &#160;matters <br />discharged &#160;and &#160;released &#160;under &#160;this &#160;Agreement. &#160;Facility &#160;Provider &#160;agrees &#160;that &#160;if &#160;Facility <br />Provider, or someone acting on its behalf, &#160;should &#160;file, &#160;or &#160;cause &#160;to &#160;be &#160;filed, &#160;any &#160;such &#160;claim, <br />charge, complaint, or action against the Company, Facility Provider expressly waives any and <br />all &#160;rights &#160;to &#160;recover &#160;any &#160;damages &#160;or &#160;other &#160;relief &#160;from &#160;the &#160;Company &#160;including, &#160;without <br />limitation, costs and attorneys’ fees.  
      </p>
      <p
        style="position: absolute; top: 494px; left: 162px; white-space: nowrap"
        class="ft120"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 513px; left: 108px; white-space: nowrap"
        class="ft122"
      >
        .
      </p>
      <p
        style="position: absolute; top: 513px; left: 162px; white-space: nowrap"
        class="ft122"
      >
        The indemnification obligations under this Clause shall survive the termination of this 
      </p>
      <p
        style="position: absolute; top: 534px; left: 108px; white-space: nowrap"
        class="ft124"
      >
        Agreement.  <br /> <br /> <br /><b>12. FORCE MAJEURE <br /></b
        > <br />The failure or delay by the Company hereto to perform any obligation under this Agreement <br />solely &#160;by &#160;reason &#160;of &#160;acts &#160;of &#160;God, &#160;acts &#160;of &#160;government, &#160;riots, &#160;wars, &#160;embargoes, &#160;pandemics, <br />strikes, compulsory lockdown, pandemics, accidents in transportation, or other causes beyond <br />the &#160;control &#160;(all &#160;the &#160;above &#160;eventualities &#160;hereinafter &#160;collectively &#160;referred &#160;to &#160;as &#160;“<b
          >Force <br />majeure</b
        >”) occurring at or affecting the place or premises of discharging its obligations, shall <br />not &#160;be &#160;deemed &#160;to &#160;be &#160;a &#160;breach &#160;of &#160;this &#160;Agreement, &#160;till &#160;such &#160;time &#160;as &#160;the &#160;Force &#160;Majeure <br />continues. <br /> <br /> <br /><b
          >13. JURISDICTION AND DISPUTE RESOLUTION </b
        >
      </p>
      <p
        style="position: absolute; top: 876px; left: 108px; white-space: nowrap"
        class="ft126"
      >
        a. &#160;All &#160;disputes &#160;arising &#160;out &#160;of &#160;or &#160;in &#160;connection &#160;with &#160;this &#160;Agreement, &#160;including &#160;any &#160;question <br />regarding &#160;its &#160;existence, &#160;validity &#160;or &#160;termination, &#160;shall &#160;be &#160;governed &#160;and &#160;construed &#160;under &#160;the <br />Laws &#160;of &#160;India, &#160;without &#160;any &#160;reference &#160;to &#160;its &#160;conflict &#160;of &#160;law &#160;and &#160;rules, &#160;and &#160;the &#160;courts &#160;of <br />Coimbatore, Tamil Nadu, India shall have exclusive jurisdiction. 
      </p>
      <p
        style="position: absolute; top: 983px; left: 108px; white-space: nowrap"
        class="ft126"
      >
        b. The same &#160;shall &#160;be &#160;resolved &#160;by &#160;Arbitration &#160;under &#160;Arbitration &#160;and &#160;Conciliation &#160;Act, &#160;1996, <br />incorporated &#160;at &#160;the &#160;above &#160;address. &#160;The &#160;language &#160;of &#160;the &#160;arbitration &#160;proceedings &#160;shall &#160;be <br />English and the seat shall be at Coimbatore, Tamil Nadu, India. 
      </p>
      <p
        style="
          position: absolute;
          top: 1065px;
          left: 182px;
          white-space: nowrap;
        "
        class="ft124"
      >
         <br /> 
      </p>
      <p
        style="
          position: absolute;
          top: 1108px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft123"
      >
        <b>14. NON-SOLICITATION AND NON-COMPETE </b>
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft120"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      
      p {
        margin: 0;
        padding: 0;
      }
      .ft130 {
        font-size: 16px;
        font-family: AAAAAA + Carlito;
        color: #000000;
      }
      .ft131 {
        font-size: 17px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft132 {
        font-size: 17px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft133 {
        font-size: 17px;
        line-height: 24px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft134 {
        font-size: 17px;
        line-height: 21px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft135 {
        font-size: 17px;
        line-height: 24px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
    </style>
  </head>
  <body background="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page13-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft130"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft133"
      >
        a. &#160;During &#160;the &#160;Term &#160;of &#160;this &#160;Agreement &#160;and &#160;for &#160;a &#160;period &#160;of &#160;two &#160;(2) &#160;years &#160;after &#160;the &#160;date &#160;of <br />expiry or termination of this Agreement, the Facility Provider shall not, directly or indirectly, <br />(i) hire, engage or solicit to hire or engage any individual who is engaged as a &#160;contractor &#160;or <br />consultant or employed by the Company or who was engaged as a contractor or consultant or <br />employed &#160;by &#160;the &#160;Company &#160;within &#160;six &#160;months &#160;of &#160;the &#160;proposed &#160;solicitation, &#160;hire &#160;or <br />engagement, (ii) otherwise induce or &#160;attempt &#160;to &#160;induce &#160;any &#160;individual &#160;who &#160;is &#160;engaged &#160;as &#160;a <br />contractor &#160;or &#160;consultant &#160;or &#160;employed &#160;by &#160;the &#160;Company &#160;to &#160;terminate &#160;such &#160;engagement &#160;or <br />employment, (iii) in any way interfere &#160;with &#160;the &#160;relationship &#160;between &#160;the &#160;Company &#160;and &#160;any <br />individual who is engaged as &#160;a &#160;contractor &#160;or &#160;consultant &#160;or &#160;employed &#160;by &#160;the &#160;Company; &#160;(iv) <br />contact, solicit, divert, appropriate or call upon with the intent of doing business with &#160;(other <br />than for the exclusive benefit of the Company) any User, if the purpose of such activity is to <br />solicit such User for a Competing Business, to encourage such User to discontinue, reduce or <br />adversely &#160;alter &#160;the &#160;amount &#160;of &#160;such &#160;User’s &#160;business &#160;with &#160;the &#160;Company &#160;or &#160;to &#160;otherwise <br />interfere with the Company’s relationship with such User, or (v) in any way interfere with the <br />Company’s relationship &#160;with &#160;any &#160;supplier, &#160;manufacturer, &#160;facility &#160;provider &#160;or &#160;other &#160;business <br />relation of the Company. 
      </p>
      <p
        style="position: absolute; top: 522px; left: 108px; white-space: nowrap"
        class="ft133"
      >
        b. &#160;During &#160;the &#160;Term &#160;of &#160;this &#160;Agreement &#160;and &#160;for &#160;a &#160;period &#160;of &#160;two &#160;(2) &#160;years &#160;after &#160;the &#160;date &#160;of <br />expiry or termination of this Agreement, the Facility Provider shall not, directly or indirectly, <br />(i) shall not, throughout the territory of the world, either solely or jointly with or on behalf of <br />any person, directly or indirectly, whether as a shareholder, joint venture partner, consultant, <br />agent, distributor, Company, employee, or consultant, enter into or in any manner take part in <br />any business or commercial activity (whether incidental or ancillary) relating to &#160;the &#160;existing <br />or &#160;future &#160;or &#160;contemplated &#160;business &#160;or &#160;activities &#160;of &#160;the &#160;Company &#160;(ii) &#160;shall &#160;not &#160;directly &#160;or <br />indirectly compete with the business of the Company; engage or assist others in engaging in <br />any business or enterprise (whether as owner, partner, officer, director, employee, consultant, <br />investor, lender, or otherwise) that is competitive with the Company’s business, including but <br />not limited to any business or enterprise that develops, manufactures, markets, licenses, sells, <br />or &#160;provides &#160;any &#160;product &#160;or &#160;service &#160;that &#160;competes &#160;with &#160;any &#160;product &#160;or &#160;service &#160;developed, <br />manufactured, &#160;marketed, &#160;licensed, &#160;sold, &#160;or &#160;provided, &#160;or &#160;planned &#160;to &#160;be &#160;developed, <br />manufactured, marketed, licensed, sold, or provided, by the Company (iii) shall not hold any <br />interest &#160;as &#160;owner, &#160;sole &#160;proprietor, &#160;stockholder, &#160;partner, &#160;lender, &#160;director, &#160;officer, &#160;manager, <br />employee, &#160;consultant, &#160;agent, &#160;or &#160;otherwise &#160;in &#160;any &#160;business &#160;competitive &#160;with &#160;that &#160;of &#160;the <br />Company. 
      </p>
      <p
        style="position: absolute; top: 960px; left: 108px; white-space: nowrap"
        class="ft135"
      >
         <br /><b>15. SUB-LEASING OF FACILITIES  <br /> </b>
      </p>
      <p
        style="
          position: absolute;
          top: 1031px;
          left: 141px;
          white-space: nowrap;
        "
        class="ft131"
      >
        a.
      </p>
      <p
        style="
          position: absolute;
          top: 1031px;
          left: 174px;
          white-space: nowrap;
        "
        class="ft133"
      >
        The &#160;Company &#160;may &#160;rent &#160;or &#160;lease &#160;Facilities &#160;from &#160;the &#160;Facility &#160;Provider &#160;directly, <br />through &#160;or &#160;outside &#160;the &#160;Platform &#160;for &#160;the &#160;purpose &#160;of &#160;sub-leasing, &#160;licencing &#160;or <br />assigning &#160;them &#160;to &#160;Users &#160;or &#160;any &#160;third &#160;parties, &#160;either &#160;through &#160;the &#160;Platform &#160;or <br />independently.  
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft130"
      >
        &#160;
      </p>
    </div>
    <div
      id="page14-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft140"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 141px; white-space: nowrap"
        class="ft141"
      >
        b.&#160;The terms and conditions of this Agreement shall then bind the Facility Provider in 
      </p>
      <p
        style="position: absolute; top: 132px; left: 174px; white-space: nowrap"
        class="ft143"
      >
        strict terms, wherever the context permits. The Facility Provider &#160;shall &#160;adhere &#160;to &#160;all <br />obligations, &#160;warranties, &#160;and &#160;responsibilities &#160;outlined &#160;in &#160;this &#160;Agreement, &#160;and &#160;shall <br />cooperate &#160;with &#160;the &#160;Company &#160;for &#160;execution &#160;of &#160;necessary &#160;agreements, &#160;compliances, <br />for obtaining necessary approvals, licences etc. 
      </p>
      <p
        style="position: absolute; top: 231px; left: 108px; white-space: nowrap"
        class="ft143"
      >
        <b> <br />16. COUNTERPARTS <br /></b
        >This Agreement may be signed in any number of counterparts, each &#160;of &#160;which &#160;is &#160;an &#160;original <br />and all of which, taken together, constitutes one and the same instrument. 
      </p>
      <p
        style="position: absolute; top: 348px; left: 108px; white-space: nowrap"
        class="ft142"
      >
        <b> </b>
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft140"
      >
        &#160;
      </p>
         <div
      id="page15-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft150"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft154"
      >
         <br /><b
          >22.&#160;COMPLIANCE WITH APPLICABLE LAW AND COMPANY’S POLICIES <br /></b
        > <br />The Facility Provider (i) &#160;shall &#160;comply &#160;with &#160;all &#160;applicable &#160;Laws &#160;and &#160;Company’s &#160;Policies &#160;in <br />performing under this Agreement; (ii) shall &#160;not &#160;do, &#160;or &#160;fail &#160;to &#160;do, &#160;any &#160;act &#160;that &#160;will &#160;cause &#160;or <br />lead the Company to &#160;be &#160;in &#160;breach &#160;of &#160;Laws &#160;applicable; &#160;and &#160;(iii) &#160;have &#160;and &#160;shall &#160;maintain &#160;in <br />place &#160;throughout &#160;the &#160;term &#160;of &#160;this &#160;Agreement &#160;their &#160;own &#160;policies &#160;and &#160;procedures, &#160;including <br />adequate procedures &#160;under &#160;applicable &#160;Laws &#160;and &#160;Company’s &#160;Policies, &#160;to &#160;ensure &#160;compliance <br />with the relevant Laws, Company’s Policies and shall comply with them where appropriate. <br /> <br />IN &#160;WITNESS &#160;WHEREOF, &#160;the &#160;Parties &#160;hereto &#160;have &#160;executed &#160;this &#160;Agreement &#160;as &#160;of &#160;the <br />Effective Date. <br /> <br />For Company:<b
          >   <br /></b
        >Signature with Seal
      </p>
      <p
        style="position: absolute; top: 454px; left: 594px; white-space: nowrap"
        class="ft151"
      >
                
      </p>
      <p
        style="position: absolute; top: 479px; left: 108px; white-space: nowrap"
        class="ft153"
      >
        Date: <br />Place: <br /> <br /> <br />For Facility Provider: <br />Signature with Seal <br />Date:  <br />Place:  <br /> <br /> <br />IN WITNESS WHEREOF,  
      </p>
      <p
        style="position: absolute; top: 769px; left: 157px; white-space: nowrap"
        class="ft153"
      >
        1.&#160; <br />2.&#160; 
      </p>
      <p
        style="position: absolute; top: 819px; left: 108px; white-space: nowrap"
        class="ft155"
      >
        <b> <br /></b> <br /> 
      </p>
      <p
        style="position: absolute; top: 901px; left: 108px; white-space: nowrap"
        class="ft151"
      >
         
      </p>
      <p
        style="position: absolute; top: 936px; left: 108px; white-space: nowrap"
        class="ft151"
      >
         
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft150"
      >
        &#160;
      </p>
    </div>
    </div>
    
  </body>
</html>
<!-- <!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
    <style type="text/css">
      body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; /* or center for vertical centering */
        min-height: 100vh;
        margin: 0;
      }

      p {
        margin: 0;
        padding: 0;
      }
      .ft10 {
        font-size: 16px;
        font-family: AAAAAA + Carlito;
        color: #000000;
      }
      .ft11 {
        font-size: 17px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft12 {
        font-size: 17px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft13 {
        font-size: 16px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft14 {
        font-size: 17px;
        line-height: 21px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft15 {
        font-size: 17px;
        line-height: 23px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft16 {
        font-size: 16px;
        line-height: 23px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
    </style>
  </head>
  <body bgcolor="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page14-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft140"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 141px; white-space: nowrap"
        class="ft141"
      >
        b.&#160;The terms and conditions of this Agreement shall then bind the Facility Provider in 
      </p>
      <p
        style="position: absolute; top: 132px; left: 174px; white-space: nowrap"
        class="ft143"
      >
        strict terms, wherever the context permits. The Facility Provider &#160;shall &#160;adhere &#160;to &#160;all <br />obligations, &#160;warranties, &#160;and &#160;responsibilities &#160;outlined &#160;in &#160;this &#160;Agreement, &#160;and &#160;shall <br />cooperate &#160;with &#160;the &#160;Company &#160;for &#160;execution &#160;of &#160;necessary &#160;agreements, &#160;compliances, <br />for obtaining necessary approvals, licences etc. 
      </p>
      <p
        style="position: absolute; top: 231px; left: 108px; white-space: nowrap"
        class="ft143"
      >
        <b> <br />16. COUNTERPARTS <br /></b
        >This Agreement may be signed in any number of counterparts, each &#160;of &#160;which &#160;is &#160;an &#160;original <br />and all of which, taken together, constitutes one and the same instrument. 
      </p>
      <p
        style="position: absolute; top: 348px; left: 108px; white-space: nowrap"
        class="ft142"
      >
        <b> </b>
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft140"
      >
        &#160;
      </p>
    </div>
  </body>
</html>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
  <head>
    <title>
      static/downloads/65fa443d-109a-4821-bfb6-95b6c1816649/Facility-Provider-Agreement-cumma-platform-html.html
    </title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <br />
     <style type="text/css">
      body {
         display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; /* or center for vertical centering */
        min-height: 100vh;
        margin: 0;
        background-color: #A0A0A0;
      }

      p {
        margin: 0;
        padding: 0;
      }
      .ft10 {
        font-size: 16px;
        font-family: AAAAAA + Carlito;
        color: #000000;
      }
      .ft11 {
        font-size: 17px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft12 {
        font-size: 17px;
        font-family: CAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft13 {
        font-size: 16px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft14 {
        font-size: 17px;
        line-height: 21px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft15 {
        font-size: 17px;
        line-height: 23px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
      .ft16 {
        font-size: 16px;
        line-height: 23px;
        font-family: BAAAAA + LiberationSerif;
        color: #000000;
      }
    </style>
  </head>
  <body bgcolor="#A0A0A0" vlink="blue" link="blue">
    <div
      id="page15-div"
      style="position: relative; width: 892px; height: 1262px"
    >
      <img
        width="892"
        height="1262"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATvCAIAAADSI2UWAAAACXBIWXMAABCbAAAQmwF0iZxLAAATtklEQVR42u3WMREAAAjEMMC/50cFx5JI6NROUgAAcGkkAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6JQAAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDolAADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOiUAAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAGA6AQAwnQAAYDoBADCdAACYTgAAMJ0AAJhOAAAwnQAAmE4AAEwnAACYTgAATCcAAKYTAABMJwAAphMAAEwnAACmEwAA0wkAAKYTAADTCQCA6QQAANMJAIDpBAAA0wkAgOkEAMB0AgCA6QQAwHQCAGA6AQDAdAIAYDoBAMB0AgBgOgEAMJ0AAGA6AQAwnQAAmE4AADCdAACYTgAAMJ0AAJhOAABMJwAAmE4AAEwnAACmEwAATCcAAKYTAABMJwAAphMAANMJAACmEwAA0wkAgOkEAADTCQCA6QQAANMJAIDpBADAdAIAgOkEAMB0AgBgOgEAwHQCAGA6AQDAdAIAYDoBADCdAABgOgEAMJ0AAJhOAAAwnQAAmE4AADCdAACYTgAATCcAAJhOAABMJwAAphMAAEwnAACmEwAATCcAAKYTAADTCQAAphMAANMJAIDpBAAA0wkAgOkEAADTCQCA6QQAwHQCAIDpBADAdAIAYDoBAMB0AgBgOgEAwHQCAPBmAY94DNsKSZkTAAAAAElFTkSuQmCC"
        alt="background image"
      />
      <p
        style="position: absolute; top: 54px; left: 108px; white-space: nowrap"
        class="ft150"
      >
        &#160;
      </p>
      <p
        style="position: absolute; top: 108px; left: 108px; white-space: nowrap"
        class="ft154"
      >
         <br /><b
          >22.&#160;COMPLIANCE WITH APPLICABLE LAW AND COMPANY’S POLICIES <br /></b
        > <br />The Facility Provider (i) &#160;shall &#160;comply &#160;with &#160;all &#160;applicable &#160;Laws &#160;and &#160;Company’s &#160;Policies &#160;in <br />performing under this Agreement; (ii) shall &#160;not &#160;do, &#160;or &#160;fail &#160;to &#160;do, &#160;any &#160;act &#160;that &#160;will &#160;cause &#160;or <br />lead the Company to &#160;be &#160;in &#160;breach &#160;of &#160;Laws &#160;applicable; &#160;and &#160;(iii) &#160;have &#160;and &#160;shall &#160;maintain &#160;in <br />place &#160;throughout &#160;the &#160;term &#160;of &#160;this &#160;Agreement &#160;their &#160;own &#160;policies &#160;and &#160;procedures, &#160;including <br />adequate procedures &#160;under &#160;applicable &#160;Laws &#160;and &#160;Company’s &#160;Policies, &#160;to &#160;ensure &#160;compliance <br />with the relevant Laws, Company’s Policies and shall comply with them where appropriate. <br /> <br />IN &#160;WITNESS &#160;WHEREOF, &#160;the &#160;Parties &#160;hereto &#160;have &#160;executed &#160;this &#160;Agreement &#160;as &#160;of &#160;the <br />Effective Date. <br /> <br />For Company:<b
          >   <br /></b
        >Signature with Seal
      </p>
      <p
        style="position: absolute; top: 454px; left: 594px; white-space: nowrap"
        class="ft151"
      >
                
      </p>
      <p
        style="position: absolute; top: 479px; left: 108px; white-space: nowrap"
        class="ft153"
      >
        Date: <br />Place: <br /> <br /> <br />For Facility Provider: <br />Signature with Seal <br />Date:  <br />Place:  <br /> <br /> <br />IN WITNESS WHEREOF,  
      </p>
      <p
        style="position: absolute; top: 769px; left: 157px; white-space: nowrap"
        class="ft153"
      >
        1.&#160; <br />2.&#160; 
      </p>
      <p
        style="position: absolute; top: 819px; left: 108px; white-space: nowrap"
        class="ft155"
      >
        <b> <br /></b> <br /> 
      </p>
      <p
        style="position: absolute; top: 901px; left: 108px; white-space: nowrap"
        class="ft151"
      >
         
      </p>
      <p
        style="position: absolute; top: 936px; left: 108px; white-space: nowrap"
        class="ft151"
      >
         
      </p>
      <p
        style="
          position: absolute;
          top: 1177px;
          left: 108px;
          white-space: nowrap;
        "
        class="ft150"
      >
        &#160;
      </p>
    </div>
  </body>
</html> -->


  `;

  return html;
}

function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

module.exports = { fillContractTemplate };