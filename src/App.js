import { useState } from "react";
import { Button, Container, Card, Form } from 'react-bootstrap';
import json5 from "json5";
import { parseKle } from "./KLEParser";

function App() {

  const [kleText, setKleText] = useState("")
  // const [kleData, setKleData] = useState(null)
  console.log("KLE input text: " + kleText)

  let statusMessage = ""

  let kleData = parseKle(kleText)
  if (kleData === null) {
    statusMessage = "Parse failed"
  }
  else {
    statusMessage = "Parsed successfully"
    console.log("Parsed output of key objects:")
    let keyStringArr = []
    for (const key of kleData) {
      keyStringArr.push(key.toString())
    }
    console.log(keyStringArr)
  }

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
      
    </Container>
  );
}

export default App;
