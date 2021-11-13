export {};
// import { useState } from "react";
// import Paper from "@mui/material/Paper";
// import TableContainer from "@mui/material/TableContainer";
// import Table from "@mui/material/Table";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";

// const columns = [
//   { id: "name", label: "Name", minWidth: 200 },
//   { id: "address", label: "Address", minWidth: 250 },
//   {
//     id: "ratified",
//     label: "Nomination Ratified",
//     minWidth: 170,
//     align: "center",
//     format: (value: number) => value.toLocaleString("en-US")
//   },
//   {
//     id: "nominations",
//     label: "Nominations",
//     minWidth: 170,
//     format: (value: number) => value.toLocaleString("en-US")
//   }
// ];

// interface Row {
//   address: string;
//   name: string;
//   ratified: number;
//   nominations: string[];
// }

// const rows: Row[] = [
//   {
//     address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
//     name: "Matt",
//     ratified: Date.now(),
//     nominations: [
//       "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
//       "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
//       "0x90f79bf6eb2c4f870365e785982e1f101e93b906"
//     ]
//   },
//   {
//     address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
//     name: "Bob",
//     ratified: Date.now(),
//     nominations: [
//       "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
//       "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
//       "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65"
//     ]
//   },
//   {
//     address: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
//     name: "Selma",
//     ratified: Date.now(),
//     nominations: [
//       "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
//       "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
//       "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc"
//     ]
//   },
//   {
//     address: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
//     name: "Jennifer",
//     ratified: Date.now(),
//     nominations: [
//       "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
//       "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
//       "0x976ea74026e726554db657fa54763abd0c3a0aa9"
//     ]
//   },
//   {
//     address: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
//     name: "Stacy",
//     ratified: Date.now(),
//     nominations: [
//       "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
//       "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
//       "0x90f79bf6eb2c4f870365e785982e1f101e93b906"
//     ]
//   },
//   {
//     address: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
//     name: "Josh",
//     ratified: Date.now(),
//     nominations: [
//       "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
//       "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
//       "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65"
//     ]
//   }
// ];

// export default function StickyHeadTable() {
//   //   const [page, setPage] = useState(0);
//   //   const [rowsPerPage, setRowsPerPage] = useState(10);

//   //   const handleChangePage = (_, newPage) => {
//   //     setPage(newPage);
//   //   };

//   //   const handleChangeRowsPerPage = (event) => {
//   //     setRowsPerPage(+event.target.value);
//   //     setPage(0);
//   //   };

//   return (
//     <Paper sx={{ width: "100%", overflowX: "hidden" }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align}
//                   style={{ minWidth: column.minWidth }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// }
