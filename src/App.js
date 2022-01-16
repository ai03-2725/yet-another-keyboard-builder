import { useState, useEffect } from "react";
import { Button, Container, Card, Form } from 'react-bootstrap';
import json5 from "json5";
import { parseKle } from "./KLEParser";
import Decimal from "decimal.js";


function App() {

  const [kleText, setKleText] = useState("")
  const [kleData, setKleData] = useState(null)
  console.log("KLE input text: " + kleText)

  let statusMessage = ""

  // console.log(parseKle(kleText))
  useEffect(() => {
    setKleData(parseKle(kleText))
  }, [kleText])

  return (
    <Container className="App">
      <h1>Test</h1>
      <p>Plategen will happen here</p>
      <Card className="rounded">
        <Form>
          <Form.Label as="h5" className="pt-2">KLE Data</Form.Label>
          <Form.Control 
            as="textarea" 
            style={{fontFamily: 'monospace'}}
            spellCheck="false"
            placeholder="Paste KLE raw data here" 
            onChange={text => setKleText(text.target.value)}/>
        </Form>
      </Card>
      <p>{statusMessage}</p>
      {kleData !== null &&
      <p>Set</p>
      }
      
    </Container>
  );
}

export default App;
