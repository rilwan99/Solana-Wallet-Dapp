import styles from '../styles/Home.module.css'
import { AppBar } from '../components/dashboard/AppBar'
import { BasicTable } from '../components/dashboard/Table'


const Dashboard: React.FC = () => {

    return (
        <div>
            <AppBar />
            <div className={styles.AppBody}>
                <BasicTable />
            </div>
        </div>
    );
}
export default Dashboard