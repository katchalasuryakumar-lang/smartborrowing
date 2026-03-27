import React, { useState, useEffect } from 'react';
import { useAuth, api } from './services/api';
import { Search, ShoppingBag, User, LogOut, Menu, X, Plus, ArrowRight, Shield, Clock, CreditCard, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const Navbar = ({ user, onLogout, setPage }: any) => (
  <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-2">B</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">SmartBorrow</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => setPage('browse')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Browse</button>
          <button onClick={() => setPage('lend')} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Lend Item</button>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <button onClick={() => setPage('dashboard')} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                <User size={20} />
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </button>
              <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={() => setPage('login')} className="px-4 py-2 text-gray-600 font-medium hover:text-blue-600 transition-colors">Login</button>
              <button onClick={() => setPage('register')} className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const ItemCard = ({ item, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
    onClick={() => onClick(item)}
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
        {item.category}
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-black text-blue-600">₹{item.price_per_day}</span>
          <span className="text-gray-400 text-sm"> / day</span>
        </div>
        <button className="bg-gray-50 group-hover:bg-blue-600 p-2 rounded-xl transition-colors">
          <ArrowRight size={18} className="text-gray-400 group-hover:text-white" />
        </button>
      </div>
    </div>
  </motion.div>
);

// --- Pages ---

const HomePage = ({ setPage }: any) => (
  <div className="space-y-20 pb-20">
    <section className="relative h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-6xl sm:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
            Borrow & Lend <br />
            <span className="text-blue-600">Items Easily.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join your community in sharing tools, electronics, and more. 
            Save money, reduce waste, and connect with neighbors.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={() => setPage('browse')} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200">
              Start Borrowing
            </button>
            <button onClick={() => setPage('lend')} className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-blue-600 transition-all">
              Lend Your Items
            </button>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Featured Items</h2>
          <p className="text-gray-500">Handpicked items from your community</p>
        </div>
        <button onClick={() => setPage('browse')} className="text-blue-600 font-bold flex items-center hover:underline">
          View all <ArrowRight size={18} className="ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-80 bg-gray-50 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    </section>

    <section className="bg-blue-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-12">Why Choose SmartBorrow?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Shield className="w-10 h-10" />, title: 'Secure Payments', desc: 'Integrated Razorpay for safe and easy transactions.' },
            { icon: <Clock className="w-10 h-10" />, title: 'Flexible Duration', desc: 'Borrow for a day, a week, or as long as you need.' },
            { icon: <CreditCard className="w-10 h-10" />, title: 'Security Deposit', desc: 'Protected lending with refundable security deposits.' }
          ].map((feature, i) => (
            <div key={i} className="text-white space-y-4">
              <div className="mx-auto w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-blue-100">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const BrowsePage = ({ setPage, setSelectedItem }: any) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/items').then(setItems);
  }, []);

  const filteredItems = items.filter((item: any) => 
    (category === 'All' || item.category === category) &&
    (item.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Browse Items</h1>
          <p className="text-gray-500">Find what you need, when you need it.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-6 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Tools</option>
            <option>Sports</option>
            <option>Books</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredItems.map((item: any) => (
          <ItemCard key={item.id} item={item} onClick={(item: any) => {
            setSelectedItem(item);
            setPage('details');
          }} />
        ))}
      </div>
    </div>
  );
};

const ItemDetailsPage = ({ item, setPage, user }: any) => {
  const [duration, setDuration] = useState(1);
  
  if (!item) return null;

  const totalRent = item.price_per_day * duration;
  const totalAmount = totalRent + item.security_deposit;

  const handleBorrow = () => {
    if (!user) {
      setPage('login');
      return;
    }
    setPage('payment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl" referrerPolicy="no-referrer" />
        </motion.div>
        
        <div className="space-y-8">
          <div>
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-4">
              {item.category}
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">{item.name}</h1>
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center">
                <User size={18} className="mr-2" />
                <span>Owned by <span className="font-bold text-gray-900">{item.owner_name}</span></span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 rounded-3xl space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-bold mb-1">Rental Price</p>
                <p className="text-4xl font-black text-blue-600">₹{item.price_per_day}<span className="text-lg text-gray-400 font-normal"> / day</span></p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm uppercase tracking-wider font-bold mb-1">Security Deposit</p>
                <p className="text-2xl font-bold text-gray-900">₹{item.security_deposit}</p>
              </div>
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Borrow Duration (Days)</label>
              <div className="flex items-center space-x-4">
                <button onClick={() => setDuration(Math.max(1, duration - 1))} className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-2xl font-bold hover:border-blue-600 transition-colors">-</button>
                <span className="text-2xl font-black w-12 text-center">{duration}</span>
                <button onClick={() => setDuration(duration + 1)} className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-2xl font-bold hover:border-blue-600 transition-colors">+</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl space-y-3 shadow-sm">
              <div className="flex justify-between text-gray-600">
                <span>Rent (₹{item.price_per_day} × {duration} days)</span>
                <span>₹{totalRent}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Security Deposit (Refundable)</span>
                <span>₹{item.security_deposit}</span>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div className="flex justify-between text-xl font-black text-gray-900">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={handleBorrow} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200">
                Borrow Now
              </button>
              {user?.id === item.owner_id && (
                <button 
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this item?')) {
                      await api.delete(`/items/${item.id}`);
                      setPage('dashboard');
                    }
                  }}
                  className="px-6 py-5 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
                  title="Delete Item"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = ({ item, duration, user, setPage }: any) => {
  const totalRent = item.price_per_day * duration;
  const totalAmount = totalRent + item.security_deposit;

  const handlePayment = async () => {
    // 1. Create Borrow Request
    const request = await api.post('/borrow', {
      item_id: item.id,
      borrower_id: user.id,
      duration_days: duration,
      total_amount: totalAmount
    });

    // 2. Create Razorpay Order
    const order = await api.post('/payments/create-order', {
      amount: totalAmount,
      requestId: request.id
    });

    // 3. Open Razorpay
    const options = {
      key: "rzp_test_dummy", // In real app, get from env
      amount: order.amount,
      currency: "INR",
      name: "SmartBorrow",
      description: `Borrowing ${item.name}`,
      order_id: order.id,
      handler: async (response: any) => {
        await api.post('/payments/verify', {
          ...response,
          requestId: request.id,
          amount: totalAmount
        });
        alert('Payment Successful!');
        setPage('dashboard');
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: { color: "#2563eb" },
      modal: {
        ondismiss: function() {
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-10 text-white text-center">
          <h1 className="text-3xl font-black mb-2">Checkout</h1>
          <p className="text-blue-100">Complete your payment to confirm borrowing</p>
        </div>
        
        <div className="p-10 space-y-8">
          <div className="flex items-center space-x-6">
            <img src={item.image_url} className="w-24 h-24 rounded-2xl object-cover" referrerPolicy="no-referrer" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
              <p className="text-gray-500">{duration} days rental</p>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-8 rounded-3xl">
            <div className="flex justify-between text-gray-600">
              <span>Rental Fee</span>
              <span className="font-bold">₹{totalRent}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Security Deposit</span>
              <span className="font-bold">₹{item.security_deposit}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between text-2xl font-black text-gray-900">
              <span>Total to Pay</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={handlePayment} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200 flex items-center justify-center">
              <CreditCard className="mr-3" /> Pay with Razorpay
            </button>
            <p className="text-center text-gray-400 text-sm">
              Your security deposit is fully refundable upon safe return of the item.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ user }: any) => {
  const [data, setData] = useState<any>(null);
  const [reviewing, setReviewing] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const refresh = () => {
    if (user) api.get(`/dashboard/${user.id}`).then(setData);
  };

  useEffect(refresh, [user]);

  const handleReturn = async (requestId: number) => {
    await api.post('/borrow/return', { requestId });
    const loan = data.activeLoans.find((l: any) => l.id === requestId);
    setReviewing(loan);
    refresh();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/items/${id}`);
    setDeletingId(null);
    refresh();
  };

  const submitReview = async () => {
    await api.post('/borrow/review', { requestId: reviewing.id, rating, comment });
    setReviewing(null);
    setRating(5);
    setComment('');
    refresh();
  };

  if (!data) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-gray-900">User Dashboard</h1>
        <div className="flex space-x-4">
          <div className="bg-blue-50 px-6 py-3 rounded-2xl">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Items Lent</p>
            <p className="text-2xl font-black text-gray-900">{data.activeLoans.length + data.lendingHistory.length}</p>
          </div>
          <div className="bg-green-50 px-6 py-3 rounded-2xl">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Items Borrowed</p>
            <p className="text-2xl font-black text-gray-900">{data.borrowedItems.length}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Active Loans Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Clock className="mr-2 text-blue-600" /> Active Loans (Items you lent)
            </h2>
            <div className="space-y-4">
              {data.activeLoans.length === 0 ? (
                <div className="p-12 bg-gray-50 rounded-3xl text-center text-gray-400 font-medium">No active loans</div>
              ) : (
                data.activeLoans.map((loan: any) => (
                  <div key={loan.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                        {loan.item_name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{loan.item_name}</h4>
                        <p className="text-sm text-gray-500">Borrower: <span className="font-bold">{loan.borrower_name || 'Manual Entry'}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {deletingId === loan.id ? (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleDelete(loan.item_id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => setDeletingId(null)}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleReturn(loan.id)}
                            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                          >
                            Mark Returned
                          </button>
                          <button 
                            onClick={() => setDeletingId(loan.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <ShoppingBag className="mr-2 text-blue-600" /> My Borrowed Items
            </h2>
            <div className="space-y-4">
              {data.borrowedItems.length === 0 ? (
                <div className="p-12 bg-gray-50 rounded-3xl text-center text-gray-400 font-medium">No borrowed items yet</div>
              ) : (
                data.borrowedItems.map((req: any) => (
                  <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={req.image_url} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-bold text-gray-900">{req.item_name}</h4>
                        <p className="text-sm text-gray-500">{req.duration_days} days • ₹{req.total_amount}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      req.status === 'returned' ? 'bg-gray-100 text-gray-600' : 
                      req.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Plus className="mr-2 text-blue-600" /> My Items for Lending
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.myItems.map((item: any) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={item.image_url} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">₹{item.price_per_day}/day</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {deletingId === item.id ? (
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeletingId(item.id)}
                        className="flex items-center space-x-1 px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Item"
                      >
                        <Trash2 size={18} />
                        <span className="text-xs font-bold">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lending History Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Shield className="mr-2 text-blue-600" /> Lending History & Reviews
            </h2>
            <div className="space-y-4">
              {data.lendingHistory.length === 0 ? (
                <div className="p-12 bg-gray-50 rounded-3xl text-center text-gray-400 font-medium">No history yet</div>
              ) : (
                data.lendingHistory.map((hist: any) => (
                  <div key={hist.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold">
                          {hist.item_name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{hist.item_name}</h4>
                          <p className="text-xs text-gray-500">Returned on {new Date(hist.returned_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">Returned</span>
                    </div>
                    {hist.rating ? (
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex items-center mb-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className={`text-lg ${s <= hist.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-700 italic">"{hist.comment}"</p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setReviewing(hist)}
                        className="text-blue-600 text-sm font-bold hover:underline"
                      >
                        + Leave a review for {hist.borrower_name || 'Borrower'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4">Lend Requests</h3>
            <div className="space-y-4">
              {data.lendRequests.length === 0 ? (
                <p className="text-blue-100 text-sm">No pending requests</p>
              ) : (
                data.lendRequests.map((req: any) => (
                  <div key={req.id} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm space-y-3">
                    <p className="text-sm font-medium">
                      <span className="font-bold">{req.borrower_name}</span> wants to borrow <span className="font-bold">{req.item_name}</span>
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => api.post('/borrow/status', { requestId: req.id, status: 'approved' }).then(refresh)}
                        className="flex-1 py-2 bg-white text-blue-600 rounded-lg font-bold text-xs"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => api.post('/borrow/status', { requestId: req.id, status: 'rejected' }).then(refresh)}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2">Review Borrower</h3>
              <p className="text-gray-500 mb-8 text-sm">How was your experience lending to {reviewing.borrower_name || 'this borrower'}?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Rating</label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        onClick={() => setRating(s)}
                        className={`text-4xl transition-all ${s <= rating ? 'text-yellow-400 scale-110' : 'text-gray-200 hover:text-yellow-200'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                  <textarea 
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    rows={3}
                    placeholder="Write a short comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={() => setReviewing(null)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitReview}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AuthPage = ({ type, onLogin, setPage }: any) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = type === 'login' ? '/login' : '/register';
    const res = await api.post(endpoint, formData);
    if (res.error) {
      setError(res.error);
    } else {
      onLogin(res);
      setPage('home');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">B</div>
          <h2 className="text-3xl font-black text-gray-900">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-500 mt-2">{type === 'login' ? 'Enter your details to continue' : 'Join the community sharing platform'}</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200">
            {type === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setPage(type === 'login' ? 'register' : 'login')}
            className="text-gray-500 font-medium hover:text-blue-600 transition-colors"
          >
            {type === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const LendPage = ({ user, setPage }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    price_per_day: '',
    security_deposit: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setPage('login');
      return;
    }

    await api.post('/items', { ...formData, owner_id: user.id });
    alert('Item listed successfully!');
    setPage('browse');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Lend an Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
              <input 
                type="text" required
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="e.g. Canon DSLR Camera"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                required rows={4}
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="Describe your item..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Electronics</option>
                <option>Tools</option>
                <option>Sports</option>
                <option>Books</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price per Day (₹)</label>
              <input 
                type="number" required
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="50"
                value={formData.price_per_day}
                onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Security Deposit (₹)</label>
              <input 
                type="number" required
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="500"
                value={formData.security_deposit}
                onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
              <input 
                type="url" required
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200">
            List Item
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { user, login, logout } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    // Force layout recalculation
    window.dispatchEvent(new Event('resize'));
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'browse': return <BrowsePage setPage={setPage} setSelectedItem={setSelectedItem} />;
      case 'details': return <ItemDetailsPage item={selectedItem} setPage={setPage} user={user} />;
      case 'payment': return <PaymentPage item={selectedItem} duration={1} user={user} setPage={setPage} />;
      case 'dashboard': return <DashboardPage user={user} />;
      case 'lend': return <LendPage user={user} setPage={setPage} />;
      case 'login': return <AuthPage type="login" onLogin={login} setPage={setPage} />;
      case 'register': return <AuthPage type="register" onLogin={login} setPage={setPage} />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar user={user} onLogout={logout} setPage={setPage} />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-2">B</div>
              <span className="text-lg font-bold text-gray-900">SmartBorrow</span>
            </div>
            <div className="flex space-x-8 text-gray-500 font-medium">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <div className="mt-6 md:mt-0 text-gray-400 text-sm">
              © 2026 SmartBorrow System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
