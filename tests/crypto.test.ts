import {describe, expect} from "@jest/globals";
import {createHash} from "../src/crypto";


describe('createHash()', () => {
    it('Creates correct hash of number 228', () => {
        expect(createHash('228'))
            .toEqual('9d693eeee1d1899cbc50b6d45df953d3835acf28ee869879b45565fccc814765')
    });

    it('Creates same hash with parameters in different order', () => {
        expect(createHash(228, { 10: 10 }, '5')).toEqual(createHash({ 10: 10 }, '5', 228))
    });

    it('Creates different hash on input change', () => {
        const obj: any = {}
        const originalHash = createHash(obj)
        obj['a'] = '228'

        expect(createHash(obj)).not.toEqual(originalHash)
    });
})
