import React, { useState } from 'react';
import '../css/shipments.css';
import { Button, Table } from 'react-bootstrap';
import { Couriers, Packages } from '../api/data';
import "../styles/shipments.css";
import FutureShipments from './futureShipments';

function Shipments() {
    const [data, setData] = useState<any>(Couriers.sort((a, b) => b.maxpackages - a.maxpackages));
    const [inf, setInf] = useState<any>(Packages);

    const [delayed, setDelayed] = useState<any>([]);
    const [one, setOne] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [comp, setComp] = useState(false);
    const [courierPackages, setCourierPackages] = useState<any>([]); // Estado para guardar paquetes asignados

    console.log("this are my", Couriers, Packages);

    const assing = () => {
        let remainingPackages = [...Packages]; // Copiamos la lista de paquetes

        const assignedPackages = data.map((courier: any) => {
            const maxPackages = courier.maxpackages;
            const assigned = remainingPackages.slice(0, maxPackages); // Tomamos los primeros maxPackages paquetes
            remainingPackages = remainingPackages.slice(maxPackages); // Actualizamos los paquetes restantes
            return { ...courier, packages: assigned }; // Retornamos el courier con sus paquetes asignados
        });

        setInf(assignedPackages); // Guardamos la nueva asignación en inf
        setOne(true); // Cambia el estado para reflejar que ya se asignaron paquetes
        console.log("Packages Assigned:", assignedPackages);
    };

    const delayespa = () => {
        if (one === false) {
            console.log("tas mamando");
        } else {
            setHidden(true);
            setDelayed(inf);
        }
    };

    const comple = () => {
        if (one === false) {
            console.log("tas mamando");
        } else {
            setComp(!comp);
        }
    };

    return (
        <>
            <div className='titleone'>
                <h2 className=''>Today</h2>
                <h3 style={{ justifySelf: "center" }}>aa</h3>
            </div>

            <div className="container-lg" style={{ background: "grey" }}>
                <Button onClick={assing}>Assign</Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th colSpan={2}>Delivery man</th>
                            <th colSpan={3}>MAX</th>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <th>maxP</th>
                            <th>Packages</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item: any, index: number) => (
                            <tr key={`delivery-man-${index}`} style={{ background: comp === true && index === 0 ? 'green' : '' }}>
                                <td>
                                    <h2 className='namecss'>{item.name}</h2>
                                </td>
                                <td>
                                    <h2 className='namecss'>{item.maxpackages}</h2>
                                </td>
                                <td>
                                    {one && inf?.[index]?.packages?.length > 0 ? (
                                        inf[index].packages.map((pkg: any, pkgIndex: number) => (
                                            <div key={`package-${pkgIndex}`}>{pkg.name}</div>
                                        ))
                                    ) : (
                                        <div>''</div>
                                    )}
                                </td>
                                <td>on the way</td>
                                <td>
                                    <Button className='btn' onClick={comple}>COMPLETE</Button>
                                    <Button onClick={delayespa}>DELAY</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <FutureShipments one={one} inf={delayed} />
        </>
    );
}

export default Shipments;
