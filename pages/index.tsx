import fs from 'fs';
import path from 'path';
import { useDispatch, useSelector } from 'react-redux';
import { GetStaticProps, GetStaticPaths, GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import * as actionA from '../stores/storeA/actions';
import * as actionB from '../stores/storeB/actions';
import { useEffect } from 'react';
import { CombinedState } from '../stores/rootStore';




const Home: NextPage<Props> = ({ item }) => {
    const dispatch = useDispatch();
    useEffect(() => 
    {
        dispatch(actionA.startFetchingUsers());
        dispatch(actionB.startFetchingUsers());
        return () => {
            dispatch(actionA.stopFetchingUsers());
            dispatch(actionB.stopFetchingUsers());
        }
    }, [dispatch]);

    const state = useSelector<CombinedState, {character: any[], error: any[], isFetchedOnServer: boolean[]}>(state => {
        console.log(state);
        return {
            character: [state.dataA.character, state.dataB.characterForB],
            error: [state.dataA.error, state.dataB.errorForB],
            isFetchedOnServer: [state.dataA.isFetchedOnServer, state.dataB.isFetchedOnServerForB]
        }
    })
    
    return (
        <>
            <div>
                {item.map(i => (
                    <div key={i.id}>{i.content}</div>
                ))}
            </div>
            <div style={{display: 'flex'}}>
                <div>
                    <p>
                        (was user fetched on server? - <b>{state.isFetchedOnServer[0]})</b>
                    </p>
                    <div>
                    {state.error[0] ? (
                        <p>We encountered and error.</p>
                    ) : (
                        <article>
                        <h3>Name: {state.character[0].name}</h3>
                        <p>Id: {state.character[0].id}</p>
                        <p>Username: {state.character[0].username}</p>
                        <p>Email: {state.character[0].email}</p>
                        <p>Phone: {state.character[0].phone}</p>
                        <p>Website: {state.character[0].website}</p>
                        </article>
                    )}
                    </div>
                </div>
                <div>
                    <p>
                        (was user fetched on server? - <b>{state.isFetchedOnServer[1]})</b>
                    </p>
                    <div>
                    {state.error[1] ? (
                        <p>We encountered and error.</p>
                    ) : (
                        <article>
                        <h3>Name: {state.character[1].name}</h3>
                        <p>Id: {state.character[1].id}</p>
                        <p>Username: {state.character[1].username}</p>
                        <p>Email: {state.character[1].email}</p>
                        <p>Phone: {state.character[1].phone}</p>
                        <p>Website: {state.character[1].website}</p>
                        </article>
                    )}
                    </div>
                </div>
            </div>
        </>
    )
}



// Test.getInitialProps = async ({req}) => {
//     console.log(req);
//     return {item: []}
// }

export interface Item {
    id: number,
    content: string
}

interface Props {
    item: Item[]
}
interface Params extends ParsedUrlQuery {
    id: string
}

export const getStaticProps = async () => {
    const dir = path.join(process.cwd(), 'assets', 'test.json');
    const data = fs.readFileSync(dir, 'utf8');
    return {
        props: {
            item: JSON.parse(data)
        },
        // revalidate: 10,
    };
}



export default Home;