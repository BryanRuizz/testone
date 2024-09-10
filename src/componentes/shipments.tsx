import React, { useState } from 'react';
import '../css/shipments.css';
import { Button, Table } from 'react-bootstrap';
import { Couriers, Packages } from '../api/data';
import "../styles/shipments.css";
import FutureShipments from './futureShipments';

function Shipments() {
    const [data, setData] = useState<any>(Couriers.sort((a, b) => b.maxpackages - a.maxpackages));// order the array XD find maxp as fisrt
    const [inf, setInf] = useState<any>([]);
    const [one, setOne] = useState(false);

    //#region start function asigned to every carrier
    const assing = () => {
        //temporal package
        let temppackage = [...Packages];

        // asign package to curriers
        const assignedPackages = data.map((courier: any) => {
            const maxPackages = courier.maxpackages;
            const assigned = temppackage.slice(0, maxPackages); // first package
            temppackage = temppackage.slice(maxPackages); //update rest of

            // asign status
            const packstatus = assigned.map(pkg => ({ ...pkg, status: 'On the way' }));//on the way or in way
            return { ...courier, packages: packstatus };
            //create
        });

        // asign p with not asigned
        const noas = { name: 'No Assigned', maxpackages: 0, packages: temppackage };
        const updatedInf = [...assignedPackages, noas];

        setInf(updatedInf); // set new info
        setOne(true); // change my ban
    };
    //#endregion end asigned function 

    //#region function hstatus package complete or delayed 
    const updatePackageStatus = (courierIndex: number, packageIndex: number, status: string) => {
        if (status === 'Delayed') {
            handleDelayedPackage(courierIndex, packageIndex);
        } else {
            // update complete status 
            const updatedInf = inf.map((courier: any, i: number) => {
                if (i === courierIndex) {
                    const updatedPackages = courier.packages.map((pkg: any, j: number) => {
                        if (j === packageIndex) {
                            return { ...pkg, status };
                        }
                        return pkg;
                    });
                    return { ...courier, packages: updatedPackages };
                }
                return courier;
            });

            setInf(updatedInf);
        }
    };
    //#endregion end function


    //#region handle delayed function
    const handleDelayedPackage = (courierIndex: number, packageIndex: number) => {
        const updatedInf = inf.map((courier: any, index: number) => {
            if (index === courierIndex) {
                const updatedPackages = courier.packages.filter((pkg: any, j: number) => j !== packageIndex);
                return { ...courier, packages: updatedPackages };
            }
            return courier;
        });

        // update json in index selected to delayedxxd
        const notasigned = updatedInf.findIndex((courier: any) => courier.name === 'No Assigned');
        const delayedPackage = inf[courierIndex].packages[packageIndex];
        const updatedNoAssignedCourier = {
            ...updatedInf[notasigned],
            packages: [...updatedInf[notasigned].packages, { ...delayedPackage, status: 'Delayed' }]
        };

        updatedInf[notasigned] = updatedNoAssignedCourier;

        setInf(updatedInf);
    };
    //#endregion end hanled delayed package

    console.log(inf);
    return (
        <>
            <div className='titleone'>
                <h2 >Today</h2>
            </div>

            <div className="container-lg" style={{ background: "grey", marginBottom: "6rem" }}>
                <Button onClick={assing}>Assign</Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th colSpan={2}>Delivery man</th>
                            <th>Packages</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inf.map((courier: any, courierIndex: number) => (
                            <>
                                {courier.packages.length > 0 ? (
                                    <>
                                        {courier.packages
                                            .filter((pkg: any) => pkg.status === 'Completed' || pkg.status === 'On the way')
                                            .map((pkg: any, pkgIndex: number) => (
                                                <tr
                                                    key={`Packages-${pkgIndex}`}

                                                >
                                                    {pkgIndex === 0 ? (
                                                        <>
                                                            <td rowSpan={courier.packages.filter((pkg: any) => pkg.status === 'Completed' || pkg.status === 'On the way').length}>
                                                                <h2 className='namecss'>{courier.name}</h2>
                                                            </td>
                                                            <td rowSpan={courier.packages.filter((pkg: any) => pkg.status === 'Completed' || pkg.status === 'On the way').length}>
                                                                <h2 className='namecss'>{courier.maxpackages}</h2>
                                                            </td>
                                                        </>
                                                    ) : null}
                                                    <td
                                                        style={{ background: pkg.status != "Completed" ? "" : "#00ff21", color: pkg.status != "Completed" ? "" : "white" }}
                                                    >{pkg.name}</td>
                                                    <td
                                                        style={{ background: pkg.status != "Completed" ? "" : "#00ff21", color: pkg.status != "Completed" ? "" : "white" }}
                                                    >{pkg.status}</td>
                                                    <td
                                                        style={{ background: pkg.status != "Completed" ? "" : "#00ff21" }}
                                                    >
                                                        <Button
                                                            className='btn'
                                                            onClick={() => updatePackageStatus(courierIndex, pkgIndex, 'Completed')}
                                                            disabled={pkg.status !== 'On the way'}
                                                        >
                                                            COMPLETE
                                                        </Button>
                                                        <Button
                                                            className='btn'
                                                            onClick={() => updatePackageStatus(courierIndex, pkgIndex, 'Delayed')}
                                                            disabled={pkg.status !== 'On the way'}
                                                        >
                                                            DELAY
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </>
                                ) : (
                                    <tr key={`n°Package-${courierIndex}`}>
                                        <></>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </Table>
            </div>

            <FutureShipments one={one} inf={inf} />
        </>
    );
}

export default Shipments;
