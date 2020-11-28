import express from 'express';
import Test, { ITest } from '../models/test';

const router = express.Router();

router.get('/api/test', async (req, res) => {
    const tests: Array<ITest> = await Test.find({});

    console.log(tests);
    // console.log(JSON.stringify(tests));

    return res.send(tests);
});

router.post('/api/test', async (req, res) => {
    const { title, desc } = req.body;

    const test:ITest = new Test({title, desc});
    await test.save();
    return res.status(201).send(test);

    // return res.send('NEW TEST CREATED');
});

router.patch('/api/test/:title', async (req, res) => {
    const findTitle:string = req.params.title;

    await Test.update(
        {title:findTitle},
        req.body
    );
    const testAfter = await Test.findOne({title:req.body.title});

    if (testAfter === undefined) {
        return res.status(404).send();
    } else {
        return res.status(201).send(testAfter);
    }

    // return res.send('NEW TEST CREATED');
});

export { router as testRouter };
