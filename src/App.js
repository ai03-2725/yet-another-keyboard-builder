import { useState, useEffect } from "react"
import { Button, Container, Card, Form, Row, Col, Image, Tab, Nav } from 'react-bootstrap'
import { parseKle } from "./KLEParser"
import { buildPlate } from "./PlateBuilder"
import Decimal from "decimal.js"
import makerjs from 'makerjs'
import fileDownload from 'js-file-download'
import logo from './logo.png'
import { DataHelpPane } from './HelpPanes'


function App() {

  const [kleText, setKleText] = useState("")
  const [previewSvg, setPreviewSvg] = useState(null)
  const [plateSvg, setPlateSvg] = useState(null)
  const [plateDxf, setPlateDxf] = useState(null)

  const [switchCutoutType, setSwitchCutoutType] = useState("mx-basic")
  const [stabilizerCutoutType, setStabilizerCutoutType] = useState("mx-basic")
  const [acousticCutoutType, setAcousticCutoutType] = useState("none")

  const [switchRadius, setSwitchRadius] = useState(0.5)
  const [stabilizerRadius, setStabilizerRadius] = useState(0.5)
  const [acousticRadius, setAcousticRadius] = useState(0.5)

  const [unitWidth, setUnitWidth] = useState(19.05)
  const [unitHeight, setUnitHeight] = useState(19.05)
  const [kerf, setKerf] = useState(0)







  // console.log(parseKle(kleText))
  useEffect(() => {

    const kleReturn = parseKle(kleText)

    if (kleReturn && kleReturn.length > 0) {
      try {
        const plateData = buildPlate(kleReturn, {
          switchCutoutType: switchCutoutType,
          stabilizerCutoutType: stabilizerCutoutType,
          acousticCutoutType: acousticCutoutType,
          switchFilletRadius: new Decimal(switchRadius),
          stabilizerFilletRadius: new Decimal(stabilizerRadius),
          acousticFilletRadius: new Decimal(acousticRadius),
          unitWidth: new Decimal(unitWidth),
          unitHeight: new Decimal(unitHeight),
          kerf: new Decimal(kerf),
        })

        const previewSvgData = makerjs.exporter.toSVG(plateData, { stroke: 'white', strokeWidth: '0.5mm', svgAttrs: { width: '100%', height: '100%' } })
        setPreviewSvg(previewSvgData)
        const svgData = makerjs.exporter.toSVG(plateData, { units: makerjs.unitType.Millimeter })
        setPlateSvg(svgData)
        const dxfData = makerjs.exporter.toDXF(plateData)
        setPlateDxf(dxfData)

      } catch (error) {
        console.log(error)
        setPreviewSvg(null)
        setPlateSvg(null)
        setPlateDxf(null)
      }

    } else {
      setPreviewSvg(null)
      setPlateSvg(null)
      setPlateDxf(null)
    }

  }, [
    kleText,
    switchCutoutType,
    stabilizerCutoutType,
    acousticCutoutType,
    switchRadius,
    stabilizerRadius,
    acousticRadius,
    unitWidth,
    unitHeight,
    kerf
  ])

  const downloadData = (fileData, extension) => {

    const date = new Date(Date.now())
    fileDownload(fileData, "plate-" + date.toISOString() + extension)


  }

  return (
    <Container className="App justify-content-center" style={{ textAlign: "center" }}>

      <div className="pt-4 pb-4">
        <Image fluid={true} src={logo} className="m-4" style={{ maxHeight: "100px" }} />

        <h1>ai03 Plate Generator</h1>
        <h5 className="pb-2">V2.0</h5>
        <p>An advanced plate generator with filleting, kerf, exact dimensions, and a variety of cutouts.</p>
      </div>

      <Card className="rounded shadow overflow-hidden mb-5">
        <Card.Body className="p-0">
          <Row>
            <Col xl={5} className="pt-3 pb-0 ps-4 pe-4">
              <h3>KLE Data</h3>
              <p>Please see the info block at the bottom for features such as rotating stabilizers.</p>
            </Col>
            <Col xl={7}>
              <Form>
                <Form.Control
                  as="textarea"
                  type="text"
                  style={{ fontFamily: 'monospace', height: '20vh', minHeight: "225px" }}
                  spellCheck="false"
                  placeholder="Paste KLE raw data here"
                  onChange={text => setKleText(text.target.value)} />
              </Form>
            </Col>
          </Row>

        </Card.Body>
      </Card>

      <Card className="rounded shadow overflow-hidden mb-5">
        {/* <Card.Header>
          KLE Data
        </Card.Header> */}
        <Card.Body>
          <Row>
            <Col lg={4}>
              <h3>Cutouts</h3>
              <p>Default values are recommended.</p>
              <br />
              <Form className="ms-3 me-3">
                <Form.Label>Switch Cutout Type</Form.Label>
                <Form.Select aria-label="switch-cutout-type"
                  selected="mx-basic"
                  className="mb-4"
                  onChange={e => setSwitchCutoutType(e.target.value)}
                >
                  <option value="mx-basic">Cherry MX Basic</option>
                  <option value="alps-skcm">Alps SKCM/L</option>
                  <option value="choc-cpg1232">Kailh Choc CPG1232</option>
                  <option value="choc-cpg1350">Kailh Choc CPG1350</option>
                  <option value="omron-b3g">Omron B3G/B3G-S</option>
                  <option value="alps-skcp">Alps SKCP</option>
                  
                </Form.Select>
                <Form.Label>Stabilizer Cutout Type</Form.Label>
                <Form.Select aria-label="stabilizer-cutout-type"
                  selected="mx-basic"
                  className="mb-4"
                  onChange={e => setStabilizerCutoutType(e.target.value)}
                >
                  <option value="mx-basic">Cherry MX Basic</option>
                  <option value="mx-small">Cherry MX Tight Fit</option>
                  <option value="alps-aek">Alps AEK</option>
                  <option value="alps-at101">Alps AT101</option>
                  <option value="none">None</option>

                </Form.Select>
                <Form.Label>Acoustic Cutout Type</Form.Label>
                <Form.Select aria-label="acoustic-cutout-type"
                  selected="none"
                  className="mb-4"
                  onChange={e => setAcousticCutoutType(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="mx-standard">Cherry MX Standard</option>
                  <option value="mx-extreme">Cherry MX Extreme</option>
                </Form.Select>
              </Form>
            </Col>

            <Col lg={4}>
              <h3>Filleting</h3>
              <p>Recommended 0.5mm; larger radii can cause issues with part fitment.</p>
              <Form className="ms-3 me-3">
                <Form.Label>Switch Cutout Fillet Radius</Form.Label>
                <Form.Control
                  type="number"
                  required
                  step=".001"
                  min="0"
                  max="100"
                  defaultValue="0.5"
                  id="switch-cutout-fillet-radius"
                  className="mb-4"
                  onChange={e => setSwitchRadius(e.target.value)}
                />
                <Form.Label>Stabilizer Cutout Fillet Radius</Form.Label>
                <Form.Control
                  type="number"
                  required
                  step=".001"
                  min="0"
                  max="100"
                  defaultValue="0.5"
                  id="stabilizer-cutout-fillet-radius"
                  className="mb-4"
                  onChange={e => setStabilizerRadius(e.target.value)}
                />
                <Form.Label>Acoustic Cutout Fillet Radius</Form.Label>
                <Form.Control
                  type="number"
                  required
                  step=".001"
                  min="0"
                  max="100"
                  defaultValue="0.5"
                  id="acoustic-cutout-fillet-radius"
                  className="mb-4"
                  onChange={e => setAcousticRadius(e.target.value)}
                />
              </Form>
            </Col>

            <Col lg={4}>
              <h3>Advanced</h3>
              <p>Best leave these alone unless you know what you are doing.</p>
              <Form className="ms-3 me-3">
                <Form.Label>Unit Width</Form.Label>
                <Form.Control
                  type="number"
                  required
                  step=".001"
                  min="0"
                  max="100"
                  defaultValue="19.05"
                  id="unit-width"
                  className="mb-4"
                  onChange={e => setUnitWidth(e.target.value)}
                />
                <Form.Label>Unit Height</Form.Label>
                <Form.Control
                  type="number"
                  required
                  step=".001"
                  min="0"
                  max="100"
                  defaultValue="19.05"
                  id="unit-height"
                  className="mb-4"
                  onChange={e => setUnitHeight(e.target.value)}
                />
                <Form.Label>Kerf</Form.Label>
                <Form.Control
                  type="number"
                  required
                  step=".001"
                  min="0"
                  max="100"
                  defaultValue="0"
                  id="kerf"
                  className="mb-4"
                  onChange={e => setKerf(e.target.value)}
                />
              </Form>
            </Col>


          </Row>

        </Card.Body>
      </Card>

      <Card className="p-0 rounded shadow bg-dark mb-5 overflow-hidden">
        <Card.Header>
          <h3 className="mt-2 text-white">Preview and Download</h3>

        </Card.Header>
        <Card.Body className="bg-dark p-4" style={{ height: "30vh", minHeight: "250px" }} dangerouslySetInnerHTML={{ __html: previewSvg }}></Card.Body>
        <Card.Footer>
          {plateDxf &&
            <Button variant="light" className="me-3" onClick={() => { downloadData(plateDxf, ".dxf") }}>Download DXF</Button>
          }
          {plateSvg &&
            <Button variant="light" onClick={() => { downloadData(plateSvg, ".svg") }}>Download SVG</Button>
          }
          {!plateDxf &&
            <Button variant="light" className="me-3" disabled>Download DXF</Button>
          }
          {!plateSvg &&
            <Button variant="light" disabled>Download SVG</Button>
          }
        </Card.Footer>
      </Card>



      <Card className="rounded shadow overflow-hidden mb-5" >


        <Tab.Container id="left-tabs-example" defaultActiveKey="data">
          <Card.Header>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="data">Custom flags</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Switch Cutout Types</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Switch Cutout Types</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Switch Cutout Types</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Switch Cutout Types</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="data" style={{ textAlign: "left" }}>
                <DataHelpPane />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <DataHelpPane />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>

        </Tab.Container>


      </Card>

      <br />



    </Container>
  );
}

export default App;
