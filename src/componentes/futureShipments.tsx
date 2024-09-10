import React from 'react';
import './../css/futureship.css';
import { Table } from 'react-bootstrap';

interface FutureProps {
  one: boolean;
  inf: any[];
}

function FutureShipments(props: FutureProps) {
  // Filtra los paquetes que están asignados al usuario "No Assigned"
  const noAssignedPackages = props.inf.find(item => item.name === 'No Assigned')?.packages || [];

  return (
    <>
      <div className='titleone'>
        <h1 className='tomorrow'>Future deliveries ("Tomorrow")</h1>
      </div>
      <div className="container-lg" style={{ background: "grey" }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {props.one && noAssignedPackages.length > 0 ? (
              noAssignedPackages.map((pkg: any, index: number) => (
                <tr key={index}>
                  <td>
                    <h3 className='packcss'>{pkg.name}</h3>
                  </td>
                  <td>DELAYED</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No packages</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default FutureShipments;
