import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Facture = ({ object, design, quantity, unity, price, customer }) => {
  const [total, settotal] = useState(0);
  const [tva, settva] = useState(0);
  const [ttc, setttc] = useState(0);
  const date = new Date();
  useEffect(() => {
    settotal(quantity * price);
    settva(total * 0.2);
    setttc(total + tva);
  }, [quantity, price, total, tva]);
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <div className="invoice-title">
            <Typography fontSize={25}>Invoice Order # 12345</Typography>
          </div>
          <hr />
          <div className="row"></div>
          <div className="row">
            <div className="col-xs-6 text-right">
              <address className="text-xl">
                <strong>Order Date:</strong>
                <br />
                {date.toLocaleString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                <br />
                <br />
              </address>
            </div>
          </div>
          <div className="invoice-title">
            <Typography className="pull-right">{customer}</Typography>
          </div>
          <div className="row"></div>
          <div className="row">
            <div className="col-xs-6 text-right">
              <address>
                <strong>Destinataire:</strong>
                Client xxx
                <br />
                <br />
              </address>
            </div>
          </div>
          <div className="invoice-title">
            <Typography className="pull-right">
              Objet: <span>{object}</span>
            </Typography>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                <strong>Order summary</strong>
              </h3>
            </div>
            <br />
            <div className="panel-body">
              <div className="table-responsive">
                <table className="table table-condensed w-full">
                  <thead>
                    <tr>
                      <td className="w-1/4">
                        <strong>Item</strong>
                      </td>
                      <td className="text-center">
                        <strong>Price</strong>
                      </td>
                      <td className="text-center">
                        <strong>Quantity</strong>
                      </td>
                      <td className="text-right">
                        <strong>Totals</strong>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {/* foreach ($order->lineItems as $line) or some such thing here */}
                    <tr>
                      <td>{design}</td>
                      <td className="text-center w-1/4">{price}</td>
                      <td className="text-center">{quantity}</td>
                      <td className="text-right">{total}</td>
                    </tr>

                    <tr>
                      <td className="thick-line" />
                      <td className="thick-line" />
                      <td className="thick-line text-center">
                        <strong>Prix HT</strong>
                      </td>
                      <td className="thick-line text-right">{total}</td>
                    </tr>
                    <tr>
                      <td className="no-line" />
                      <td className="no-line" />
                      <td className="no-line text-center">
                        <strong>TVA</strong>
                      </td>
                      <td className="no-line text-right">{tva}</td>
                    </tr>
                    <tr>
                      <td className="no-line" />
                      <td className="no-line" />
                      <td className="no-line text-center">
                        <strong>Prix TTC</strong>
                      </td>
                      <td className="no-line text-right">{ttc}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facture;
