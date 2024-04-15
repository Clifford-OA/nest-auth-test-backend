export const getHtmlContent = () => {
  const tableData = [
    {
      field1: 'Hey',
      field2: 'Sorry',
      field3: 'ShowDem',
      field4: 4000,
    },
    {
      field1: 'Hey',
      field2: 'Sorry',
      field3: 'ShowDem',
      field4: 3000,
    },
    {
      field1: 'Hey',
      field2: 'Sorry',
      field3: 'ShowDem',
      field4: 5000,
    },
    {
      field1: 'Hey',
      field2: 'Sorry',
      field3: 'ShowDem',
      field4: 7000,
    },
  ];

  return `
  <html>
  <head>
    <style>
      .container {
        padding: 10px ;
      }

      body {
        padding: 0;
        margin: 0;
      }

      .invoice-container {
        -webkit-box-pack: justify;
        display: -webkit-box;
      }

      .table {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
        margin-top: 20px;
      }

      .table td,
      .table th,
      .table tr {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
      }
      .table tr {
        padding: 5px;
      }

      .table tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      .table tr:hover {
        background-color: #ddd;
      }

      .table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
      }
    </style>
  </head>
  <body>
    <section class="container">
      <div>
        <div
          style="
            align-content: center;
            justify-content: space-between;
            display: flex;
          "
          class="invoice-container"
        >
       
          <img
            style="width: 120; height: 100; object-fit: contain; object-position: left;"
            src="
            https://satrybz.blob.core.windows.net/staging-trybz/assests/trybz_logo%201.png
            "
          />
        
          <div style="font-size: 40px; place-self: center; font-weight: bold">
            INVOICE
          </div>
        </div>

        <div class="invoice-container">
          <div style="display: block">
            <h3 style="font-weight: bold; font-size: large">FROM</h3>
            <div style="padding-bottom: 5px">Trybz</div>
            <div style="padding-bottom: 5px">info@trybzapp.com</div>
            <div style="padding-bottom: 5px">+233 243 334 123</div>
          </div>

          <div style="display: block">
            <h3 style="font-weight: bold; font-size: large">TO</h3>
            <div style="padding-bottom: 5px">Thomas Sky</div>
            <div style="padding-bottom: 5px">Banana Island Estates</div>
            <div style="padding-bottom: 5px">10643 #2 Rue Street</div>
            <div style="padding-bottom: 5px">Banana Island, Lagos</div>
            <div style="padding-bottom: 5px">Info@bananaislands.ng</div>
          </div>

          <div style="display: block; margin-bottom: 20px">
            <div style="padding-bottom: 10px">
              <div style="padding-bottom: 5px">INVOICE #: 2312342</div>
              <div style="padding-bottom: 5px">INVOICE DATE: 02-JUL-23</div>
              <div style="padding-bottom: 5px">DUE DATE: 02-JUL-23</div>
            </div>
            <h3 style="font-weight: bold; font-size: medium">AMOUNT DUE</h3>
            <h3 style="font-weight: bold; font-size: 30px; margin-top: -14px">
              N12,540.50
            </h3>
          </div>
        </div>

        <!-- Type One template -->
        <div style="margin-top: 20px">
          <div style="font-weight: bold; font-size: large">
            ITEM DESCRIPTION
          </div>
          <div
            style="
              border: 1px solid black;
              padding: 5px;
              border-radius: 5px;
              margin-top: 3px;
            "
          >
            This is my description in the pdf
          </div>
        </div>

        <!-- Type Two template -->
        <table class="table">
          <tr style="border: 1px solid #ecedee">
            <th style="width: 20px">#</th>
            <th style="text-align: left">ITEM DESCRIPTION</th>
            <th style="text-align: center; width: 100px">AMOUNT</th>
          </tr>
          <tr>
            <td>1</td>
            <td style="text-align: left">
              PHP And i want to see what happends
            </td>
            <td style="text-align: right; padding-right: 20px">N2,499</td>
          </tr>
          <tr>
            <td>9</td>
            <td style="text-align: left">JavaScript</td>
            <td style="text-align: right; padding-right: 20px">N2,500</td>
          </tr>
          <tr style="border: 0px solid #fff; background-color: #fff">
            <td style="border: 0px solid #fff"></td>
            <td
              style="
                font-weight: bold;
                text-align: right;
                border: 0px solid #fff;
              "
            >
              Sub-Total
            </td>
            <td
              style="font-weight: bold; text-align: right; padding-right: 20px; width: 200px"
            >
              N15,000
            </td>
          </tr>
        </table>

        <!-- Type three template -->
        <table class="table">
          <tr style="border: 1px solid #ecedee">
            <th style="width: 20px">#</th>
            <th style="text-align: center; width: 120px">ITEM</th>
            <th style="text-align: center;">UNIT PRICE</th>
            <th style="text-align: center; width: 120px">QTY</th>
            <th style="text-align: center; width: 120px">AMOUNT</th>
          </tr>

         ${tableData.map((item, index) => {
           return `  <tr>
          <td>${index + 1}</td>
          <td>${item.field1}</td>
          <td style="text-align: left;">
          ${item.field2}
          </td>
          <td>${item.field3}</td>
          <td style="text-align: right; padding-right: 20px">N${
            item.field4
          }</td>
        </tr>`;
         })}

          <tr style="border: 0px solid #fff; background-color: #fff">
            <td style="border: 0px solid #fff"></td>
            <td style="border: 0px solid #fff"></td>
            <td style="border: 0px solid #fff"></td>
            <td
              style="
                font-weight: bold;
                text-align: right;
                border: 0px solid #fff;
              "
            >
              Sub-Total
            </td>
            <td
              style="font-weight: bold; text-align: right; padding-right: 20px"
            >
              N15,000
            </td>
          </tr>

        </table>

        <!--  Discount section  -->
        <table class="table">
          <tr style="border: 0px solid #fff; background-color: #fff">
            <th style="width: 20px; border: 0px solid #fff">#</th>
            <th style="border: 0px solid #fff">
              DISCOUNT & CHARGES
            </th>
            <th style="border: 0px solid #fff; width:200px"></th>
          </tr>
          <tr>
            <td>1</td>
            <td style="text-align: left">Return business</td>
            <td style="text-align: right; padding-right: 20px">-N700.00</td>
          </tr>
          <tr>
            <td>2</td>
            <td style="text-align: left">Christmas discount</td>
            <td style="text-align: right; padding-right: 20px">-N325.60</td>
          </tr>
        </table>

        <!--  Tax section  -->
        <table class="table">
          <tr style="border: 0px solid #fff; background-color: #fff">
            <th style="width: 20px; border: 0px solid #fff">#</th>
            <th style="border: 0px solid #fff">TAX(ES)</th>
            <th style="border: 0px solid #fff;width:200px"></th>
          </tr>
          <tr>
            <td>1</td>
            <td style="text-align: left">Return business</td>
            <td style="text-align: right; padding-right: 20px">-N700.00</td>
          </tr>
          <tr>
            <td>2</td>
            <td style="text-align: left">Christmas discount</td>
            <td style="text-align: right; padding-right: 20px">-N325.60</td>
          </tr>
        </table>

        <!-- Grand total -->
        <table class="table">
          <tr style="border: 0px solid #fff; background-color: #fff">
            <td style="border: 0px solid #fff"></td>
            <td style="border: 0px solid #fff"></td>
            <td
              style="
                font-weight: bold;
                text-align: right;
                border: 0px solid #fff;
              "
            >
              Total
            </td>
            <td
              style="
                font-weight: bold;
                text-align: right;
                padding-right: 20px;
                width: 185px;
              "
            >
              N15,000
            </td>
          </tr>
        </table>

        <div style="padding-bottom: 20px" class="bottom">
          <div style="display: block; padding-top: 30px">
            <h3 style="font-weight: bold; font-size: large">NOTES:</h3>
            <ul>
              <li style="padding-bottom: 5px">
                if payment is not received by [valid date], this invoice is no
                longer valid. Kindly reach out for a re-issue
              </li>
              <li style="padding-bottom: 5px">
                If payment is not received by [discount validity date] any
                specified discounts will no longer apply.
              </li>
              <li style="padding-bottom: 5px">
                If payment is not received by [late payment date], an additional
                fee of [X amount /%] will apply
              </li>
            </ul>
          </div>

          <div class="invoice-container" style="padding-top: 10px">
            <div>
              <div style="font-weight: bold">ISSUED BY:</div>
              <div style="font-weight: bold; font-size: 24px; padding-top: 5px">
                Precious Uwa
              </div>
            </div>
            <div>
              <a
                style="
                  justify-self: center;
                  justify-content: center;
                  align-items: center;
                  border-radius: 20px;
                  color: white;
                  justify-items: center;
                  text-decoration: none;
                  background-color: blue;
                  width: 100px;
                  display: flex;
                  height: 40px;
                "
                href="https://portal.azure.com/"
                >Pay</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </body>
</html>

  `;
};
