const request = require('supertest')
const app = require('../app')

describe('One Settlment Per Week API TEST #1 ', () => {
    it('Testcase 1: expect response paymentDate to be 10-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/oneSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "05-02-2020" })
        expect(res.body.paymentDate).toEqual('10-02-2020')
    })
})

describe('One Settlment Per Week API TEST #2 ', () => {
    it('Testcase 2: expect response paymentDate to be 17-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/oneSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "10-02-2020" })
        expect(res.body.paymentDate).toEqual('17-02-2020')
    })
})

describe('One Settlment Per Week API TEST #3 ', () => {
    it('Testcase 3: expect response paymentDate to be 10-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/oneSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "06-02-2020" })
        expect(res.body.paymentDate).toEqual('10-02-2020')
    })
})


describe('One Settlment Per Week API TEST #4 ', () => {
    it('Testcase 4: expect response paymentDate to be 02-03-2020', async () => {
        const res = await request(app)
            .post('/tickets/oneSettlementPerWeek')
            .send({ "start": "01-02-2020", "end": "24-02-2020" })
        expect(res.body.paymentDate).toEqual('02-03-2020')
    })
})


describe('Two Settlment Per Week API TEST #1 ', () => {
    it('Testcase 5: expect response paymentDate to be 06-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/twoSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "05-02-2020" })
        expect(res.body.paymentDate).toEqual('06-02-2020')
    })
})

describe('Two Settlment Per Week API TEST #2 ', () => {
    it('Testcase 6: expect response paymentDate to be 10-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/twoSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "07-02-2020" })
        expect(res.body.paymentDate).toEqual('10-02-2020')
    })
})

describe('Two Settlment Per Week API TEST #3 ', () => {
    it('Testcase 7: expect response paymentDate to be 13-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/twoSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "10-02-2020" })
        expect(res.body.paymentDate).toEqual('13-02-2020')
    })
})

describe('Two Settlment Per Week API TEST #4 ', () => {
    it('Testcase 8: expect response paymentDate to be 20-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/twoSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "19-02-2020" })
        expect(res.body.paymentDate).toEqual('20-02-2020')
    })
})


describe('Calculate Settlment Amount TEST #1 ', () => {
    it('Testcase 9: Expect totalSum to be 521.24', async () => {
        const res = await request(app)
            .post('/tickets/calculateSettlementAmount')
            .send([
                {
                    "ticketId": "TE231FD3-23",
                    "price" : 100,
                    "MDR" : 2
                },
                {
                    "ticketId": "TE2GES23-23",
                    "price" : 200,
                    "MDR" : 4
                },
                {
                    "ticketId": "T03GD1023-23",
                    "price" : 246,
                    "MDR" : 6
                }
            ])
        expect(res.body.totalSum).toEqual(521.24)
    })
})


describe('Calculate Settlment Amount TEST #1 ', () => {
    it('Testcase 10: Expect totalSum to be 933.76', async () => {
        const res = await request(app)
            .post('/tickets/calculateSettlementAmount')
            .send([
                {
                    "ticketId": "TE231023-23",
                    "price" : 100,
                    "MDR" : 2.33
                  },
                  {
                    "ticketId": "KE23D0S3-J3",
                    "price" : 231,
                    "MDR" : 5.34
                  },
                  {
                    "ticketId": "LDL40S3-U3",
                    "price" : 659,
                    "MDR" : 6.31 
                  }
            ])
        expect(res.body.totalSum).toEqual(933.76)
    })
})


describe('Restful APIs TEST #1 ', () => {
    it('Testcase 11: POST (Insert Ticket)', async () => {
        const res = await request(app).post('/tickets')
            .send({
                "ticketId": "TES2312-32",
                "price": "203.10",
                "MDR": "2.0",
                "currency": "SGD",
                "travelAgentName": "SPLIT-TEST-AGENT01"
            })
        expect(res.body.message).toEqual("success")
    })

    it('Testcase 12: GET (Retrieve All Tickets)', async () => {
        const res = await request(app).get('/tickets')
        expect(res.body.message).toEqual("success")
    })

    it('Testcase 13: PUT (Update Ticket)', async () => {
        const res = await request(app).put('/tickets/TES2312-32')
            .send({
                "price": "203.20",
                "MDR": "2.0",
                "currency": "SGD",
                "travelAgentName": "SPLIT-TEST-AGENT01"
            })
        expect(res.body.message).toEqual("success")
    })

    it('Testcase 14: DELETE (Delete Ticket)', async () => {
        const res = await request(app).delete('/tickets/TES2312-32')
            .send({
                "ticketId": "TES2312-32"
            });
        expect(res.body.message).toEqual("success")
    })
})


describe('Valid Input Strings TEST #1 ', () => {
    it('Testcase 15: aabbcc', async () => {
        const res = await request(app)
            .post('/tickets/validate')
            .send({
                "input": "aabbcc"
            })
        expect(res.body["compile"]).toBe(true)
    })

    it('Testcase 16: aabdbcc', async () => {
        const res = await request(app)
            .post('/tickets/validate')
            .send({
                "input": "aabdbcc"
            })
        expect(res.body["compile"]).toBe(false)
    })

    it('Testcase 17: caca', async () => {
        const res = await request(app)
            .post('/tickets/validate')
            .send({
                "input": "caca"
            })
        expect(res.body["compile"]).toBe(false)
    })

    it('Testcase 18: caabbddc', async () => {
        const res = await request(app)
            .post('/tickets/validate')
            .send({
                "input": "caabbddc"
            })
        expect(res.body["compile"]).toBe(true)
    })

    it('Testcase 19: acca', async () => {
        const res = await request(app)
            .post('/tickets/validate')
            .send({
                "input": "acca"
            })
        expect(res.body["compile"]).toBe(true)
    })

    it('Testcase 20: cabbaddc', async () => {
        const res = await request(app)
            .post('/tickets/validate')
            .send({
                "input": "cabbaddc"
            })
        expect(res.body["compile"]).toBe(true)
    })

    it('Testcase 21: caabddc', async () => {
        const res = await request(app)
            .post('/tickets/validate')
            .send({
                "input": "caabddc"
            })
        expect(res.body["compile"]).toBe(false)
    })

    it('Testcase 22: caabdbdc', async () => {
        const res = await request(app)
            .post('/tickets/validate')
            .send({
                "input": "caabdbdc"
            })
        expect(res.body["compile"]).toBe(false)
    })
})