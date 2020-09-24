import {reducerDestinosViajes,
DestinoViajesState,
initializeDestinosViajesState,
InitMyDataAction,
NuevoDestinoAction, DestinoViajesAction
} from './destinos-viajes-state.model';
import {DestinoViaje} from './destino-viaje.models';
import { Action } from 'rxjs/internal/scheduler/Action';

describe('reducerDestinosViajes', () => {
    it('should reduce init data', () =>{
        const prevState: DestinoViajesState = initializeDestinosViajesState();
        const action: InitMyDataAction = new InitMyDataAction(['destino1','destino2']);
        const newState: DestinoViajesState =  reducerDestinosViajes(prevState, action);
        expect(newState.items.length).toEqual(2);
        expect(newState.items[0].nombre).toEqual('destino 1');
    });
    it('should reduce new item added', () => {
        const prevState: DestinoViajesState = initializeDestinosViajesState();
        const action: NuevoDestinoAction = new NuevoDestinoAction(new DestinoViaje('barcelona','url'));
        const newState: DestinoViajesState = reducerDestinosViajes(prevState, action);
        expect(newState.items.length).toEqual(1);
        expect(newState.items[0].nombre).toEqual('barcelona');
    
    });
});