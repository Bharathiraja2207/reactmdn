import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Documentation() {
  const [text,settext]=useState([])

  useEffect(() => {
    fetch('https://markdown-node.vercel.app/markdown')
      .then((data) => data.json())
      .then((mvs) => settext(mvs))
  }, [])
// console.log(text);
 
  return (
    <Container>
      <h3>Basic syntax:</h3>
      <br></br>
     
      <Table striped bordered hover className='table'>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Element</th>
            <th> Markdown syntax</th>
          </tr>
        </thead>
        <tbody>
          {text.map((e) => {
            return <tr>
              <td>{e.id}</td>
              <td>{e.markdown_name}</td>
              <td>{e.markdown_syntax.map((e) => <p>{e}</p>)}</td>
            </tr>;
          })}
         
        </tbody>
      </Table>

    </Container>
  );
}